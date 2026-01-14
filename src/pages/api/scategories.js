const express = require('express');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const { PrismaClient } = require('@prisma/client');
const adapter = new PrismaMariaDb({
host: "localhost",
port: 3306,
user: "root",
password: "",
database: "dbcommerce",
});
const prisma = new PrismaClient({ adapter });
const router = express.Router();
//Ajout d'une scategorie
router.post('/', async (req, res, )=> {
const {nomscategorie,imagescategorie,categorieID}=req.body
try {
const scategorie = await prisma.scategories.create({
data: {
nomscategorie: nomscategorie,
imagescategorie: imagescategorie,
categorieID:categorieID
}
})
res.json(scategorie)
} catch (error) {
res.status(500).json({
message: "Something went wrong",
})
}
});
// afficher la liste des catégories.
router.get('/', async (req, res, )=> {
try {
// scategories est le nom du model précisé dans prisma.schema
const scategories = await prisma.scategories.findMany({
include: {
categories: {
select: {
nomcategorie: true,
},
}
}
})
res.json(scategories)
} catch (error) {
    console.log(error);
    res.status(500).json({
message: "Something went wrong",
})
}
});
// afficher une scategorie.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const scategorie = await prisma.scategories.findUnique({
where: {
id: Number(id),
}
})
res.json(scategorie)
} catch (error) {
res.status(500).json({
message: "Something went wrong",
})
}
});

// modifier une scategorie
router.put('/:id', async (req, res)=> {
const {nomscategorie,imagescategorie,categorieID}=req.body
const id = req.params.id;
try {
const scategorie = await prisma.scategories.update({
data: {
nomscategorie: nomscategorie,
imagescategorie: imagescategorie,
categorieID:categorieID
},
where: { id: Number(id)},
})
res.json(scategorie);
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// Supprimer un scategories
router.delete('/:id', async (req, res)=> {
const id = req.params.id;
try {
await prisma.scategories.delete({
    where: { id: Number(id) },
})

res.json({ message: "scategory "+ id +" deleted successfully." });
} catch (error) {
res.status(404).json({message: error.message });
}
});
module.exports = router;