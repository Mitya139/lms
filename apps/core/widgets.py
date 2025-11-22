from typing import Any, Dict, Optional, Sequence

from django_filters.widgets import RangeWidget

from django import forms

from core.timezone.constants import DATE_FORMAT_RU, TIME_FORMAT_RU


class UbereditorWidget(forms.Textarea):
    """Textarea widget that enables the legacy markdown editor on the frontend.

    Adds the ``ubereditor`` CSS class so JS can auto-initialize UberEditor
    (EpicEditor wrapper) for this field.
    """

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        attrs: Dict[str, Any] = kwargs.setdefault("attrs", {})
        attrs.setdefault("class", "ubereditor")
        super().__init__(*args, **kwargs)


class AdminRichTextAreaWidget(UbereditorWidget):
    template_name = 'widgets/ubertextarea.html'


class DateTimeRangeWidget(RangeWidget):
    template_name = 'widgets/datetime_range.html'
    suffixes = ['from', 'to']

    def __init__(self, attrs: Optional[Dict[str, Any]] = None) -> None:
        widgets: Sequence[forms.DateInput] = (
            forms.DateInput(attrs={"class": "form-control",
                                   "autocomplete": "off",
                                   "placeholder": "C"}),
            forms.DateInput(attrs={"class": "form-control",
                                   "autocomplete": "off",
                                   "placeholder": "По"}),
        )
        super(RangeWidget, self).__init__(widgets, attrs)


class DateInputTextWidget(forms.DateInput):
    input_type = 'text'

    def __init__(
        self,
        attrs: Optional[Dict[str, Any]] = None,
        format: Optional[str] = None,
    ) -> None:
        format_attrs: Dict[str, Any] = {"placeholder": "dd.mm.yyyy"} if format is None else {}
        base_attrs: Dict[str, Any] = {
            "autocomplete": "off",
            "class": "form-control",
            **format_attrs,
            **(attrs or {}),
        }
        fmt = format or DATE_FORMAT_RU
        super().__init__(attrs=base_attrs, format=fmt)


class TimeInputTextWidget(forms.TimeInput):
    input_type = 'text'

    def __init__(
        self,
        attrs: Optional[Dict[str, Any]] = None,
        format: Optional[str] = None,
    ) -> None:
        format_attrs: Dict[str, Any] = {"placeholder": "hh:mm"} if format is None else {}
        base_attrs: Dict[str, Any] = {
            "autocomplete": "off",
            "class": "form-control",
            **format_attrs,
            **(attrs or {}),
        }
        fmt = format or TIME_FORMAT_RU
        super().__init__(attrs=base_attrs, format=fmt)


class JasnyFileInputWidget(forms.ClearableFileInput):
    template_name = 'widgets/file_input.html'


class MultipleFileInput(JasnyFileInputWidget):
    allow_multiple_selected = True

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.attrs['multiple'] = True
