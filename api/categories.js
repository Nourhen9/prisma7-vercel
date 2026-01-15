// api/categories.js
import { PrismaClient } from '@prisma/client'
import { createAdapterFromUrl } from '../lib/db.js'

const globalForPrisma = global
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: createAdapterFromUrl(process.env.DATABASE_URL),
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    if (method === 'GET' && !query.id) {
      const categories = await prisma.categories.findMany()
      return res.status(200).json(categories)
    }

    if (method === 'GET' && query.id) {
      const id = parseInt(query.id, 10)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' })
      }
      const category = await prisma.categories.findUnique({ where: { id } })
      if (!category) {
        return res.status(404).json({ message: 'Category not found' })
      }
      return res.status(200).json(category)
    }

    if (method === 'POST') {
      const { nomcategorie, imagecategorie } = body
      if (!nomcategorie) {
        return res.status(400).json({ message: 'nomcategorie is required' })
      }
      const category = await prisma.categories.create({
        data: { nomcategorie, imagecategorie }, // ← ✅ CORRIGÉ
      })
      return res.status(201).json(category)
    }

    if (method === 'PUT' && query.id) {
      const id = parseInt(query.id, 10)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' })
      }
      const { nomcategorie, imagecategorie } = body
      const category = await prisma.categories.update({
        where: { id },
        data: { nomcategorie, imagecategorie }, // ← ✅ CORRIGÉ
      })
      return res.status(200).json(category)
    }

    if (method === 'DELETE' && query.id) {
      const id = parseInt(query.id, 10)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' })
      }
      await prisma.categories.delete({ where: { id } })
      return res.status(200).json({ message: `Category ${id} deleted successfully.` })
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error('Categories API error:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Category not found' })
    } else {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  } finally {
    await prisma.$disconnect()
  }
}