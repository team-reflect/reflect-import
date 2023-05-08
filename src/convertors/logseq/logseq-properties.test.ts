import {describe, it, expect} from 'vitest'

import {logseqPropertiesToMarkdown} from './logseq-properties'

describe('LogseqProperties', () => {
  it('parses some properties', () => {
    expect(logseqPropertiesToMarkdown({}, {})).toEqual('')
    expect(logseqPropertiesToMarkdown({prop: 'value'}, {})).toEqual('* prop: value')
    expect(logseqPropertiesToMarkdown({prop: ['Page']}, {Page: 'abc-123'})).toEqual(
      '* prop: [[Page]]',
    )
    expect(logseqPropertiesToMarkdown({prop: 'value', prop2: 'value2'}, {})).toEqual(
      '* prop: value\n* prop2: value2',
    )
    expect(
      logseqPropertiesToMarkdown(
        {prop: 'value', multi: ['value', 'value2', 'value3']},
        {},
      ),
    ).toEqual('* prop: value\n* multi: value, value2, value3')
    expect(
      logseqPropertiesToMarkdown(
        {age: 34, friends: ['Alice', 'Bob', 'Carol']},
        {Alice: '1', Bob: '2'},
      ),
    ).toEqual('* age: 34\n* friends: [[Alice]], [[Bob]], Carol')
  })
})
