import datetime
import enum
import logging
import random
from functools import partial
from itertools import zip_longest
from typing import Any, Dict, Iterable, Iterator, List, Optional
from urllib.parse import parse_qs, urlparse

import bleach
# Markdown rendering is handled by maintained pure‑Python libraries.
# We try a few common libraries in order of preference and degrade gracefully.
_md_backend = None
_md_backend_name = None
try:  # markdown-it-py (modern CommonMark + many plugins)
    from markdown_it import MarkdownIt  # type: ignore
    from mdit_py_plugins.footnote import footnote  # type: ignore
    from mdit_py_plugins.tasklists import tasklists  # type: ignore
    from mdit_py_plugins.anchors import anchors  # type: ignore
    from mdit_py_plugins.attrs import attrs_plugin  # type: ignore

    _md_backend_name = "markdown-it-py"
    _md_backend = (
        MarkdownIt("commonmark", {'html': False})
        .enable(["table", "strikethrough", "linkify"])  # fenced code is on by default
        .use(footnote)
        .use(tasklists)
        .use(anchors)
        .use(attrs_plugin)
    )
except Exception:  # fall back silently
    try:  # mistune (fast, pure python)
        import mistune  # type: ignore

        class _MistuneRenderer:
            def __init__(self):
                # Use mistune v2 API if available; fallback to v0/v1
                try:
                    # v2
                    from mistune import create_markdown  # type: ignore

                    plugins = [
                        "strikethrough",
                        "table",
                        "task_lists",
                        "speedup",
                    ]
                    self._md = create_markdown(plugins=plugins)
                except Exception:
                    # Very old API
                    self._md = mistune.Markdown()

            def render(self, text: str) -> str:
                return self._md(text)

        _md_backend_name = "mistune"
        _md_backend = _MistuneRenderer()
    except Exception:
        try:  # python-markdown
            import markdown  # type: ignore

            class _MarkdownRenderer:
                def __init__(self):
                    exts = [
                        "extra",  # tables, etc.
                        "sane_lists",
                        "codehilite",
                        "toc",
                        "nl2br",
                        "smarty",
                    ]
                    try:
                        self._md = markdown.Markdown(extensions=exts)
                    except Exception:
                        self._md = None

                def render(self, text: str) -> str:
                    if self._md is None:
                        return text
                    return self._md.reset().convert(text)

            _md_backend_name = "python-markdown"
            _md_backend = _MarkdownRenderer()
        except Exception:
            _md_backend_name = "plain"
            _md_backend = None
import sqids.constants
from django.conf import settings
from django.core.cache import InvalidCacheBackendError, caches
from django.core.mail import EmailMultiAlternatives
from django.db.models import Max, Min
from django.template import loader
from django.utils import formats
from django.utils.html import linebreaks, strip_tags
from django_jinja.builtins.extensions import make_template_fragment_key
from sqids import Sqids

logger = logging.getLogger(__name__)

SQIDS_ALPHABET = list(sqids.constants.DEFAULT_ALPHABET)
_sqids_random = random.Random()
_sqids_random.seed(settings.HASHIDS_SALT)
_sqids_random.shuffle(SQIDS_ALPHABET)
SQIDS_ALPHABET = ''.join(SQIDS_ALPHABET)
sqids = Sqids(alphabet=SQIDS_ALPHABET, min_length=8)


class Empty(enum.Enum):
    token = 0


_empty = Empty.token

# Sanitizer allow-lists are preserved.

# This is not really about markdown, This is about html tags that will be
# saved after markdown rendering
MARKDOWN_ALLOWED_TAGS = frozenset({
    'a',
    'b',
    'blockquote',
    'br',
    'code',
    'del',
    'div',
    'dl',
    'dd',
    'dt',
    'em',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'hr',
    'i',
    'iframe',
    'img',
    'li',
    'ol',
    'p',
    'pre',
    'q',
    'strike',
    'strong',
    'table',
    'tbody',
    'td',
    'th',
    'thead',
    'tr',
    'ul',
})
MARKDOWN_ALLOWED_ATTRS = {
    '*': ['class'],
    'a': ['href', 'aria-expanded', 'role', 'data-toggle'],
    'img': ['src'],
    'iframe': ['src', 'height', 'width', 'allowfullscreen', 'frameborder'],
    'div': ['id', 'role', 'aria-labelledby', 'aria-expanded']
}


def sanitize_html(html: str) -> str:
    """Sanitize already-HTML content using the same allow-lists.

    This is used for the new WYSIWYG editor flow that stores HTML.
    """
    return bleach.clean(html, tags=MARKDOWN_ALLOWED_TAGS,
                        attributes=MARKDOWN_ALLOWED_ATTRS)


def render_rich_text(text_md: str | None, html: str | None = None) -> str:
    """Prefer sanitized HTML if provided, fallback to Markdown rendering.

    Args:
        text_md: Legacy Markdown content (optional).
        html: Preferred HTML content (optional).
    """
    if html and html.strip():
        return sanitize_html(html)
    return render_markdown(text_md or "")


def _render_markdown_raw(text: str) -> str:
    """Render Markdown to HTML using the best available backend.

    Falls back to returning the original text (escaped by bleach later) if
    no renderer is available. We intentionally disallow raw HTML in markdown
    input and rely on bleach allow-lists below for safe output.
    """
    if _md_backend_name == "markdown-it-py":
        # markdown-it-py exposes .render
        return _md_backend.render(text)  # type: ignore[union-attr]
    elif _md_backend_name in {"mistune", "python-markdown"}:
        return _md_backend.render(text)  # type: ignore[union-attr]
    # Plain fallback: just return text; line breaks handled later by bleach
    return text


def render_markdown(text: str) -> str:
    """Render markdown and sanitize the HTML output.

    Behavior compatible with previous implementation: returns sanitized HTML
    limited to MARKDOWN_ALLOWED_TAGS and MARKDOWN_ALLOWED_ATTRS.
    """
    md_rendered = _render_markdown_raw(text)
    return bleach.clean(
        md_rendered,
        tags=MARKDOWN_ALLOWED_TAGS,
        attributes=MARKDOWN_ALLOWED_ATTRS,
    )


def render_markdown_and_cache(value, fragment_name, expires_in=0, *vary_on):
    try:
        fragment_cache = caches['markdown_fragments']
    except InvalidCacheBackendError:
        fragment_cache = caches['default']
    cache_key = make_template_fragment_key(fragment_name, vary_on)
    rendered = fragment_cache.get(cache_key)
    if rendered is None:
        rendered = render_markdown(value)
        fragment_cache.set(cache_key, rendered, expires_in)
    # TODO: think about escaping
    return rendered


def admin_datetime(dt: datetime.datetime) -> str:
    return formats.date_format(dt, 'j E Y г. G:i e')


"""
Transliteration for cyrillic alphabet. Used LC ICAO doc 9303 as a reference.
Soft sign is ignored by this recommendation, we intentionally ignore this 
symbol since it's not valid for CN values in LDAP accounts. Common Name used 
as a branch name in `gerrit` code review system.
"""
_ru_en_mapping = {
    'А': "A",
    'Б': "B",
    'В': "V",
    'Г': "G",
    'Д': "D",
    'Е': "E",
    'Ё': "E",
    'Ж': "ZH",
    'З': "Z",
    'И': "I",
    'Й': "I",
    'К': "K",
    'Л': "L",
    'М': "M",
    'Н': "N",
    'О': "O",
    'П': "P",
    'Р': "R",
    'С': "S",
    'Т': "T",
    'У': "U",
    'Ф': "F",
    'Х': "KH",
    'Ц': "TS",
    'Ч': "CH",
    'Ш': "SH",
    'Щ': "SHCH",
    'Ъ': "IE",
    'Ы': "Y",
    'Ь': None,
    'Э': "E",
    'Ю': "IU",
    'Я': "IA",
    'а': "a",
    'б': "b",
    'в': "v",
    'г': "g",
    'д': "d",
    'е': "e",
    'ё': "e",
    'ж': "zh",
    'з': "z",
    'и': "i",
    'й': "i",
    'к': "k",
    'л': "l",
    'м': "m",
    'н': "n",
    'о': "o",
    'п': "p",
    'р': "r",
    'с': "s",
    'т': "t",
    'у': "u",
    'ф': "f",
    'х': "kh",
    'ц': "ts",
    'ч': "ch",
    'ш': "sh",
    'щ': "shch",
    'ъ': "ie",
    'ы': "y",
    'ь': None,
    'э': "e",
    'ю': "iu",
    'я': "ia",
}
ru_en_mapping = {ord(k): v for k, v in _ru_en_mapping.items()}


def get_youtube_video_id(video_url):
    """
    Returns Youtube video id extracted from the given valid url.

    Supported formats:
        https://youtu.be/sxnSFdRECas
        https://www.youtube.com/watch?v=0lZJicHYJXM
        http://www.youtube.com/v/_lOT2p_FCvA?version=3&amp;hl=en_US
        https://www.youtube.com/embed/8SPq-9kS69M
        https://www.youtube-nocookie.com/embed/8SPq-9kS69M
        youtube.com/embed/8SPq-9kS69M
    """
    if video_url.startswith(('youtu', 'www')):
        video_url = 'https://' + video_url
    parsed = urlparse(video_url)
    video_id = None
    if 'youtube' in parsed.hostname:
        if parsed.path == '/watch':
            qs = parse_qs(parsed.query)
            video_id = qs['v'][0]
        elif parsed.path.startswith(('/embed/', '/v/')):
            video_id = parsed.path.split('/', maxsplit=2)[2]
    elif 'youtu.be' in parsed.hostname:
        video_id = parsed.path.split('/')[1]
    return video_id


def chunks(iterable: Iterable, n: int, fillvalue: Optional[Any] = None) -> Iterator[Any]:
    """
    Collect data into fixed-length chunks or blocks:
    Example:
        In: grouper('ABCDEFG', 3, 'x')
        Out: ABC DEF Gxx
    """
    args = [iter(iterable)] * n
    return zip_longest(fillvalue=fillvalue, *args)


def bucketize(iterable, key=None, value_transform=None) -> Dict[Any, List[Any]]:
    """
    Collect data into buckets from the iterable grouping values by key.

    The *key* is a function computing a key value for each element.
    If not specified or is ``None``, *key* defaults to an identity function and
    returns the element unchanged.
    The *value_transform* is a function modifying a value before adding
    into bucket.
    """
    if key is None:
        key = lambda x: x
    if value_transform is None:
        value_transform = lambda x: x
    buckets: Dict[Any, List[Any]] = {}
    for val in iterable:
        bucket_key = key(val)
        buckets.setdefault(bucket_key, []).append(value_transform(val))
    return buckets


# noinspection PyPep8Naming
class instance_memoize:
    """
    Method decorator that helps caching the return value on the
    instance whose method was invoked. All arguments passed to a method
    decorated with `Memoize` must be hashable.

    If a memoized method is invoked directly on its class the result will not
    be cached. Instead the method will be invoked like a static method.

    Assumes that read and write operations are mutually exclusive per request.
    """

    def __init__(self, func):
        self.func = func

    def __get__(self, instance, owner=None):
        if instance is None:
            return self.func
        return partial(self, instance)

    def __call__(self, *args, **kwargs):
        obj = args[0]
        try:
            cache = obj._instance_memoize_cache
        except AttributeError:
            cache = obj._instance_memoize_cache = {}
        key = (self.func, args[1:], frozenset(kwargs.items()))
        if key not in cache:
            cache[key] = self.func(*args, **kwargs)
        return cache[key]

    @classmethod
    def delete_cache(cls, instance):
        cache_attr_name = "_instance_memoize_cache"
        if hasattr(instance, cache_attr_name):
            delattr(instance, cache_attr_name)


def create_multipart_email(
    subject: str, template: str, context: dict[str, Any], to_emails: list[str]
) -> EmailMultiAlternatives:
    html_content = linebreaks(loader.render_to_string(template, context))
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(
        subject, text_content, settings.DEFAULT_FROM_EMAIL, to_emails
    )
    msg.attach_alternative(html_content, 'text/html')
    return msg
