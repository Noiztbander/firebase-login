const { Router } = require("express");
const router = Router();
const admin =require("firebase-admin");

const serviceAccount = require("../../fir-login-5e219-firebase-adminsdk-n1sza-8b0ff62078.json");

// Iniciamos nuestra app de Firebase para usar su DB
admin.initializeApp({
	// aplica un certificado que le pasamos desde un Json prvado
	credential:admin.credential.cert(serviceAccount),
	databaseURL: process.env.databaseURL || "https://fir-login-5e219-default-rtdb.europe-west1.firebasedatabase.app/"
});

// Con esto nos conectamos a la base de datos. Esto nos devuelve un objeto que lo guardamos en DB
const db = admin.database();

// get users
router.get("/", (req, res) => {
	// el primer paso, consulta a Firebase para ver si existe la collecion especificada en ref()
	db.ref("contacts").once("value",async (snapshot)=>{
		// si, encuentra, nos devuelve todos los datos y lo almacenamos en data
		const data = await snapshot.val();
		// finalmente, renderizamos la vista y le enviamos un objeto con la data guardada
		res.render("index",{contacts: data});
	});
});

// create users
router.post("/new-contact", (req, res) => {

	const newContact = {
		firstname: req.body.firstname,
		lastname: req.body.lastname,
		email: req.body.email,
		phone: req.body.phone
	}

	// Así especificamos el nombre de la collection en la DB
	db.ref("contacts").push(newContact);
	res.redirect("/");
});

// delete users
router.get("/delete-contact/:id", (req,res)=>{
	const contactId = req.params.id;
	db.ref("contacts/" + contactId).remove();
	res.redirect("/");
});

module.exports = router;
