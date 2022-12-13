# Reflect importers

Converts a format into html.

Convertors implement `Convertor`.
They implement a `convert(options: ConvertOptions)` function and returns an array of notes.

# Example

```typescript
const convertor = new EvernoteConvertor({graphId: '123'})

const notes = convertor.convert(exexExport)

// => [{subject: '', html: '', createdAt: 123, updatedAt: 123, backlinkedNoteIds}]
```

## TODO

- [ ] Markdown task support
- [ ] Markdown tags support

## Implementation

- [x] Evernote
- [x] Roam
- [x] Markdown
- [x] Workflowy
