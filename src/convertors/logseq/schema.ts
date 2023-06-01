import {z} from 'zod'

const propertiesSchema = z.record(z.any())

const baseBlockSchema = z.object({
  format: z.string(),
  content: z.string(),
  properties: propertiesSchema.nullable(),
  id: z.string(),
})

type BlockSchema = z.infer<typeof baseBlockSchema> & {
  children: BlockSchema[]
}

const blockSchema: z.ZodType<BlockSchema> = baseBlockSchema.extend({
  children: z.lazy(() => blockSchema.array()),
})

const noteSchema = z.object({
  'page-name': z.string(),
  id: z.string(),
  children: z.array(blockSchema),
})

export const exportSchema = z.object({
  version: z.number().min(1).max(1),
  blocks: z.array(noteSchema),
})
