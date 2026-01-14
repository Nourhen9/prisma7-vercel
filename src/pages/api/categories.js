const express = require('express');
const router = express.Router();
const { PrismaMariaDb } = require ('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');
const adapter = new PrismaMariaDb({
host: "localhost",
port: 3306,
user: "root",
password: "",
database: "dbcommerce",
connectionLimit: 5
});
const prisma = new PrismaClient({ adapter });
//Ajout d'une categorie
router.post('/', async (req, res, )=> {
const {nomcategorie,imagecategorie}=req.body
try {
const categorie = await prisma.categories.create({
data: {
nomcategorie: nomcategorie,
imagecategorie: imagecategorie
}
})
res.json(categorie)
} catch (error) {
res.status(500).json({
message: "Something went wrong",
})
}
});
// afficher la liste des catégories.
router.get('/', async (req, res, )=> {
try {
// categories est le nom du model précisé dans prisma.schema
const categories = await prisma.categories.findMany()
res.json(categories)
} catch (error) {
console.log(error)
res.status(500).json({
message: "Something went wrong",
})
}
});
// afficher une categorie.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const categorie = await prisma.categories.findUnique({
where: {
id: Number(id),
}
})
res.json(categorie)
} catch (error) {
res.status(500).json({
message: "Something went wrong",
})
}
});

// modifier une categorie
router.put('/:id', async (req, res)=> {
const {nomcategorie,imagecategorie}=req.body
const id = req.params.id;
try {
const categorie = await prisma.categories.update({
data: {
nomcategorie: nomcategorie,
imagecategorie: imagecategorie
},
where: { id: Number(id)},
})
res.json(categorie);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// Supprimer un categories
router.delete('/:id', async (req, res)=> {
const id = req.params.id;
try {
await prisma.categories.delete({
where: { id: Number(id) },
})
res.json({ message: "category "+ id +" deleted successfully." });
} catch (error) {
res.status(404).json({ message: error.message });
}
});
module.exports = router;