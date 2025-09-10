import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'cortex-blog',
  title: 'Cortex Blog',
  
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'your_project_id',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  
  plugins: [
    structureTool(),
    visionTool()
  ],
  
  schema: {
    types: schemaTypes,
  },
  
  cors: {
    origin: [
      'https://your-cortex-blog.vercel.app',
      'http://localhost:3000' // Development
    ]
  },
})