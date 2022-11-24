# Reflect importers

Converts a format into html.

Convertors either implement `Convertor` or `ListConvertor`.
They implement a `convert(data: string)` function and return either a note or an array of notes respectively.

## TODO

- [x] Created at / updated at timestamps

## Implementation

- [x] Evernote
- [x] Roam
- [x] Markdown
- [ ] Workflowy
