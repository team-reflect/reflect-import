import {z} from 'zod'

const propertiesSchema = z.record(z.any())

const baseBlockSchema = z.object({
  format: z.string().optional(),
  content: z.string().optional(),
  properties: propertiesSchema.nullable().optional(),
  id: z.string().optional(),
})

type BlockSchema = z.infer<typeof baseBlockSchema> & {
  children?: BlockSchema[]
}

const blockSchema: z.ZodType<BlockSchema> = baseBlockSchema.extend({
  children: z.lazy(() => blockSchema.array()).optional(),
})

const noteSchema = z.object({
  'page-name': z.string(),
  id: z.string(),
  properties: propertiesSchema.nullable(),
  children: z.array(blockSchema).optional(),
})

export const exportSchema = z.object({
  version: z.number().min(1).max(1),
  blocks: z.array(noteSchema),
})
