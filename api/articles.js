// api/articles.js
import { PrismaClient } from '@prisma/client'
import { createAdapterFromUrl } from '../lib/prisma'

// Singleton Prisma (obligatoire pour Vercel)
const globalForPrisma = global
const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
     adapter: createAdapterFromUrl(process.env.DATABASE_URL),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default async function handler(req, res) {
  const { method, query, body } = req

  try {
    // Route: GET /api/articles
    if (method === 'GET' && !query.id && !query.page && !query.idCateg) {
      const articles = await prisma.articles.findMany({
        include: {
          scategories: {
            select: {
              nomscategorie: true,
            },
          },
        },
      })
      return res.status(200).json(articles)
    }

    // Route: GET /api/articles/:id
    if (method === 'GET' && query.id) {
      const article = await prisma.articles.findUnique({
        where: { id: parseInt(query.id) },
      })
      if (!article) return res.status(404).json({ message: 'Article not found' })
      return res.status(200).json(article)
    }

    // Route: GET /api/articles/art/pagination?page=1&limit=10
    if (method === 'GET' && query.page) {
      const page = query.page ? parseInt(query.page, 10) : 1
      const limit = query.limit ? parseInt(query.limit, 10) : 10
      const skip = (page - 1) * limit

      const articles = await prisma.articles.findMany({
        skip,
        take: limit,
        include: {
          sousCategorie: {
            include: {
              categorie: true,
            },
          },
        },
      })
      return res.status(200).json(articles)
    }

    // Route: GET /api/articles/cat/:idCateg → on utilise ?idCateg=...
    if (method === 'GET' && query.idCateg) {
      const articles = await prisma.articles.findMany({
        where: {
          scategories: {
            categorieID: parseInt(query.idCateg),
          },
        },
        include: {
          scategories: {
            include: {
              categories: true,
            },
          },
        },
      })
      return res.status(200).json(articles)
    }

    // Route: POST /api/articles
    if (method === 'POST') {
      const { designation, marque, reference, qtestock, prix, imageart, scategorieID } = body
      const article = await prisma.articles.create({
        data: {
          designation,
          marque,
          reference,
          qtestock,
          prix,
          imageart,
          scategorieID,
        },
      })
      return res.status(201).json(article)
    }

    // Route: PUT /api/articles/:id
    if (method === 'PUT' && query.id) {
      const { designation, marque, reference, qtestock, prix, imageart, scategorieID } = body
      const article = await prisma.articles.update({
        where: { id: parseInt(query.id) },
        data: {
          designation,
          marque,
          reference,
          qtestock,
          prix,
          imageart,
          scategorieID,
        },
      })
      return res.status(200).json(article)
    }

    // Route: DELETE /api/articles/:id
    if (method === 'DELETE' && query.id) {
      await prisma.articles.delete({
        where: { id: parseInt(query.id) },
      })
      return res.status(200).json({ message: 'Article deleted successfully' })
    }

    // Méthode non supportée
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${method} Not Allowed`)
  } catch (error) {
    console.error('Erreur:', error)
    res.status(500).json({ message: error.message || 'Internal Server Error' })
  }
}