// api/scategories.js
import { PrismaClient } from '@prisma/client'
import { createAdapterFromUrl } from '../lib/db.js'

// Singleton Prisma (obligatoire pour Vercel)
const globalForPrisma = global
const prisma = globalForPrisma.prisma || new PrismaClient({ adapter: createAdapterFromUrl(process.env.DATABASE_URL),})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    // GET /api/scategories
    if (method === 'GET' && !query.id) {
      const scategories = await prisma.scategories.findMany({
        include: {
          categories: {
            select: {
              nomcategorie: true,
            },
          },
        },
      })
      return res.status(200).json(scategories)
    }

    // GET /api/scategories/:id → utilise ?id=123
    if (method === 'GET' && query.id) {
      const id = parseInt(query.id, 10)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' })
      }
      const scategorie = await prisma.scategories.findUnique({
        where: { id },
      })
      if (!scategorie) {
        return res.status(404).json({ message: 'Scategorie not found' })
      }
      return res.status(200).json(scategorie)
    }

    // POST /api/scategories
    if (method === 'POST') {
      const { nomscategorie, imagescategorie, categorieID } = body
      if (!nomscategorie || !categorieID) {
        return res.status(400).json({ message: 'nomscategorie and categorieID are required' })
      }
      const scategorie = await prisma.scategories.create({
        data: { nomscategorie, imagescategorie, categorieID: parseInt(categorieID) },
      })
      return res.status(201).json(scategorie)
    }

    // PUT /api/scategories/:id
    if (method === 'PUT' && query.id) {
      const id = parseInt(query.id, 10)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' })
      }
      const { nomscategorie, imagescategorie, categorieID } = body
      const scategorie = await prisma.scategories.update({
        where: { id },
        data: {
          nomscategorie,
          imagescategorie,
          categorieID: parseInt(categorieID),
        },
      })
      return res.status(200).json(scategorie)
    }

    // DELETE /api/scategories/:id
    if (method === 'DELETE' && query.id) {
      const id = parseInt(query.id, 10)
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid ID' })
      }
      await prisma.scategories.delete({
        where: { id },
      })
      return res.status(200).json({ message: `Scategory ${id} deleted successfully.` })
    }

    // Méthode non autorisée
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error('Scategories API error:', error)
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Scategorie not found' })
    } else if (error.code === 'P2003') {
      res.status(400).json({ message: 'Invalid categorieID: foreign key constraint failed' })
    } else {
      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}