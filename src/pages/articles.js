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

//Ajout d'un article
router.post('/', async (req, res, )=> {
const { designation , marque , reference , qtestock , prix , imageart , scategorieID }=req.body
try {
const article = await prisma.articles.create({ data: {
designation : designation,
marque : marque,
reference : reference,
qtestock : qtestock, 
prix : prix,

imageart : imageart,
scategorieID:scategorieID
}
})
res.status(200).json(article);

} catch (error) {
    try {
// articles est le nom du model précisé dans prisma.schema
const Articles = await prisma.articles.findMany({
include: {
sousCategorie: {
include: {
categorie: true,
},
},
},
})
res.status(200).json(Articles);
} catch (error) {
res.status(404).json({ message: error.message });
}
}});

// afficher la liste des articles
router.get('/', async (req, res) => {
try {
const articles = await prisma.articles.findMany({
include: {
scategories: {
select: {
nomscategorie: true,
},
}
}
});
res.json(articles);
} catch (error) {
console.log(error);
res.status(500).json({
message: "Something went wrong",
});
}
});

// afficher un article.
router.get('/:id', async (req, res, )=> {
const { id } = req.params
try {
const article = await prisma.articles.findUnique({
where: {
id: Number(id),
}
})
res.status(200).json(article)
} catch (error) {
res.status(404).json({ message: error.message });
}
});
// modifier un article
router.put('/:id', async (req, res)=> {
const { designation , marque , reference , qtestock , prix , imageart ,
scategorieID }=req.body
const id = req.params.id;
try {
const article = await prisma.articles.update({
    data: {
designation : designation,
marque : marque,
reference : reference,
qtestock : qtestock,
prix : prix,
scategorieID : scategorieID,
},
where: { id: Number(id)},
})
res.status(200).json(article);
} catch (error) {
res.status(404).json({message: error.message });
}
});

// Supprimer un article 
router.delete('/:id', async (req,
res)=> {
const id = req.params.id; try {
await prisma.articles.delete({ where: { id:
Number(id) },
})
res.status(200).json({ message: "Article deleted successfully" });
} catch (error) {
res.status(404).json({ message: error.message });
}
});
router.get('/art/pagination', async (req, res) => { try {
const page_str = req.query.page; const limit_str =
req.query.limit;
const page = page_str ? parseInt(page_str, 10) : 1; const limit = limit_str ?
parseInt(limit_str, 10) : 10; const skip = (page - 1) * limit;
const articles = await prisma.articles.findMany({ skip,
take:limit, include: {
sousCategorie:{ include: {
categorie: true,
},
},
},
});

res.status(200).json(articles);
} catch (error) {
res.status(404).json({message: error.message, });
}
});
//liste des articles pour une catégorie donnée
router.get('/cat/:idCateg', async (req, res) => { 
const { idCateg } = req.params;

try {
const articles = await prisma.articles.findMany({
where: {
scategories: {
categorieID: Number(idCateg)
}
},
include: {
scategories: {
include: {
categories: true
}
}
},
});

res.json(articles);
} catch (error) { 
console.log(error);
res.status(500).json({
message: "Something went wrong", 
error: error.message, 
});
}
});

module.exports = router;