import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

export const getLanguage = () => {
  return (
    i18n.language ||
    (typeof window !== "undefined" && window.localStorage.i18nextLng) ||
    "fr"
  );
};

export const customTranslation = (translationString) => {
  return i18n.t(translationString);
};

var selectedLang = localStorage.getItem("language");

export default i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {},
      },
      fr: {
        translation: {
          ///////////////////// GENERAL /////////////////////////
          "Select Field": "Sélectionnez un champ",
          Field: "Domaine",
          Fields: "Des champs",
          "Select User": "Sélectionnez un utilisateur",
          User: "l' Utilisateur",
          "Start Time": "Heure de début",
          "End Time": "Heure de fin",
          "Booking Details": "Détails de Réservation",
          "Raised From": "Élevé à partir de",
          "Activate Student": "Activer l'étudiant",
          "Activate Instructor": "Activer l'instructeur",
          "Take Action": "Passer à l'action",
          "Go Back": "Retourner",
          "Instructor/DrivingSchool": "Instructeur/Auto École",
          "Payment Verification": "Vérification des paiements",
          Verify: "Vérifier",
          Business: "Entreprise",
          "Expiry Date": "Date d'expiration",
          "SIrel Number": "N° de SIRET",
          "Upload your kbls": "Télécharge ton KBIS",
          "Insurance Company": "Compagnie d'assurance",
          "Police Number": "N° de Police",
          "Upload your RC Pro": "Télécharge ton assurance RC Pro",
          Employee: "Employé",
          "External provider": "Indépendant",
          "Date of the authorization to exercise":
            "Date de délivrance de l'autorisation d'exercer",
          "Issuing Authority": "Délivré par",
          "Expiration date": "Date d'expiration",
          "Scan and upload your authorization":
            "Télécharge ton autorisation d'exercer",
          "Scan and Upload your Driving License":
            "Télécharge ton permis de conduire (recto/verso)",
          "Date of Obtaining": "Date d'obtention",
          Number: "Nombre",
          "Driver's License": "Permis de conduire",
          "Confirm Password": "Confirmez le mot de passe",
          "Place of Birth": "Lieu de naissance",
          Delete: "Effacer",
          Edit: "Éditer",
          "Add Meetup Point": "Ajouter un point de rencontre",
          Actions: "Actions",
          "Upload Vehicle Registration Certificate":
            "Télécharge ta carte grise (recto/verso)",
          "Upload Scaned Green Card": "Télécharger la carte verte numérisée",
          "Scan and upload your CT": "Télécharge ton contrôle technique",
          "Upload Image": "Télécharger l'Image",
          "Add Vehicle": "Ajouter un véhicule",
          "View current File": "Afficher le fichier actuel",
          "Second Phone": "",
          "Second Email": "",
          "Will work on our Platform for":
            "Travaillera sur notre plate-forme pour",
          "Working On Other Platform": "Travailler sur une autre plate-forme",
          "Ban till:": "Interdire jusqu'à:",
          "15 Days": "15 jours",
          "30 Days": "30 jours",
          Update: "Mettre à jour",
          Complement: "Complément d'adresse",
          "Upload front of your ID Card/Passport/Residence permit":
            "Télécharge le recto de ta CNI/Passeport/Permis de séjour",
          "Upload back of your ID Card/Passport/Residence permit":
            "Télécharge le verso de ta CNI/Passeport/Permis de séjour",
          "NEPH number": "Numéro NEPH",
          "Highway Code Date": "Date D'Obtention Du Code",
          "Zip Code": "Code Postal",
          Gender: "Sexe",
          DOB: "DOB",
          "First Name": "Prénom",
          "Sur Name": "Nom",
          SurName: "Nom",
          Account: "Compte",
          "Log out": "Se Déconnecter",
          Reset: "La remise",
          Filter: "Filtre",
          Search: "Rechercher",
          "Driving Membership": "Conduire l'Adhésion",
          Paid: "Payé",
          Free: "Libérer",
          "Instructor Membership": "Adhésion d'Instructeur",
          "Student Membership": "Adhésion étudiante",
          "Membership Type": "Type d'Adhésion",
          Monthly: "Mensuel",
          Quarterly: "Trimestriel",
          Yearly: "Annuel",
          "Package Name": "Nom du paquet",
          Price: "Prix",
          Duration: "Durée",
          "Package Price": "Prix ​​du coffret",
          "Package Description": "Description du paquet",
          For: "Pour",
          Description: "La description",
          "Package Details": "Détails du package",
          Settings: "Paramètres",
          "Log in": "Connexion",
          Save: "Confirmer",
          Password: "Mot de passe",
          Dashboard: "Tableau de bord",
          "Membership Packages": "Packages Forfaits",
          Users: "Utilisateurs",
          Payments: "Paiements",
          Disputes: "Litiges",
          "Update Requests": "Demandes de mise à jour",
          "User Limitations": "Limites des utilisateurs",
          "Permispop Admin Interface": "d'administration PermisPop",
          "Back to list": "Revenir à la liste",
          "Admin Login": "Connexion administrateur",
          "Enter your email and password to login with Permispop":
            "Entrez votre email et votre mot de passe pour vous connecter avec Permispop",
          Student: "Étudiant",
          Students: "Étudiants",
          Instructor: "Instructeur",
          DSInstructor: "DSInstructeur",
          Instructors: "Instructeurs",
          "Driving School": "Auto École",
          "Rental Car Company": "Loueur de voitures",
          "Close Booking": "Fermer la réservation",
          "Close All booking in between two dates":
            "Clotûrer toutes les réservations entre 2 dates",
          "START DATE": "Date de début",
          "END DATE": "Date de fin",
          "Message/Reason": "Commentaire/Raison",
          "Close Bookings": "Fermer les réservations",
          "Booking Count": "Nombre de réservations",
          "Users with max booking count":
            "Nombre de réservation par utilisateur",
          "Send Reports via mail": "Envoyer des rapports par e-mail",
          "current week": "Cette semaine",
          "Gender Count": "Répartion H/F",
          "Number of user by gender register to platform":
            "Nombre d'utilisateurs par sexe s'inscrivent sur la plateforme",
          Male: "Homme",
          Female: "Femme",
          Others: "Autres",
          Other: "Autre",
          "Non Verified": "Non vérifié",
          Verified: "Vérifié",
          "SHOW ENTRIES": "AFFICHER LES INSCRIPTIONS",
          "No matching records found": "Aucun résultat",
          "Showing # entries": "Affichage de # entrées",
          Name: "Nom",
          Role: "Rôle",
          Active: "Actif",
          "Document Verified": "Document Verfié",
          "View details": "Voir les détails",
          Email: "Email",
          "Date of Birth": "Date de naissance",
          Address: "Adresse",
          City: "Ville",
          Phone: "Téléphone",
          "Spoken Language/s": "Langue(s) parlée(s)",
          "Personal Detail": "Détail personnel",
          "Front Id": "Recto Pièce d'identité",
          "Back Id": "Verso Pièce d'identité",
          "Update User": "Mettre à jour",
          "Ban User": "Bannir",
          "Un-ban": "Débannir",
          "De-Active": "Désactiver",
          "No Added Yet": "Pas encore ajouté",
          "Re-Active": "Réactiver",
          "Delete User": "Supprimer",
          "Send Email Non-Verified Document":
            "Envoyer un mail avec les documents non vérifiés",
          Document: "Document",
          "Verification Status": "ÉTAT DE LA VÉRIFICATION",
          "Not a member": "N'est pas un membre",

          "View file in new Tab": "Ouvrir le fichier dans un nouvel onglet",
          "For Updating Data click on button Update Data under profile info card":
            "Pour mettre à jour les données, cliquez sur le bouton Mettre à jour les données sous la carte d'informations de profil",
          "under profile info card": "sous la carte d'informations du profil",
          "Update Data": "Mettre à jour les données",
          "For Updating Data click on button":
            "Pour mettre à jour les données, cliquez sur le bouton",

          "Meetup Points": "Points de rencontre",
          "Driving License": "Permis de conduire",
          "Authorization to Exercise": "Autorisation d'exercer",
          KBL: "KBIS",
          "RC Pro": "RC Pro",
          "Green Card": "Carte verte",
          "Vehicle Details": "Détails du véhicule",
          "Vehicle1 Details": "Détail du véhicule 1",
          "Vehicle1 Details": "Détail du véhicule 2",
          "Vehicle1 Detail": "Détails du véhicule",
          "Vehicle Insurance": "Assurance du véhicule",
          "Technical Control": "Contrôle technique",
          "Number Plate": "Plaque d'immatriculation",
          "Update Vehicle": "Mettre à jour le véhicule",
          "Date Of First Registration": "Date de première immatriculation",
          Brand: "Constructeur",
          Color: "Couleur",
          Model: "Modèle",
          GearBox: "Boîte de vitesse",
          Energy: "Carburant",
          Insurer: "Assureur",
          "Start Date": "Date de début",
          "End Date": "Date de fin",
          "Are you sure want to delete this vehicle?":
            "Êtes-vous sûr de supprimer ce véhicule ?",
          "Are you sure want to delete this meetup location?":
            "Êtes-vous sûr de supprimer ce point de rendez-vous ?",
          "Add Meetup Location": "Ajouter un point de rencontre",
          "Driving School Approval": "Approbation de l'auto école",
          "Identity Of Instructor": "IDENTITÉ DE L'INSTRUCTEUR",
          "Type of contract with the driving school":
            "Type de contrat avec l'Auto École",
          "Verify User": "Vérifier l'utilisateur",
          "No Inactive User": "Aucun utilisateur inactif",
          "No active User": "Aucun utilisateur actif",
          "Raised By": "Crée par",
          "Raised Against": "Crée contre",
          Comments: "Commentaires",
          Status: "Statut",
          "view details": "Voir les détails",
          Take: "Action	Agir",
          "Change Status": "Changer le statut",
          Open: "Ouvrir",
          Closed: "Fermer",
          "Student Suspended": "Élève suspendu",
          "Intructor Suspended": "Instructeur suspendu",
          "Admin Comment": "Commentaires de l'admin",
          Dispute: "Litige",
          "Update Profile": "Mettre à jour le profil",
          "Dispute Details": "Détails du litige",
          "Update Profile Data Request":
            "Mettre à jour la demande de données de profil",
          "No Updation Request in pending":
            "Aucune demande de mise à jour en attente",
          "Update Field": "Mettre à jour le champ",
          "No Updation request Completed":
            "Aucune demande de mise à jour terminée",
          Pending: "En attente",
          Completed: "Complété",
          "Vehicle Add Limit Instructor":
            "Limite d'ajout de véhicule pour les instructeurs",
          "Vehicle Add Limit Driving School":
            "Limite d'ajout de véhicule pour l'auto école",
          "DrivingSchool Instructor Limit":
            "Limite d'ajout d'instructeur pour l'auto école",
          "Max Booking Allowed/Week":
            "Maximum de réservation autorisée / Semaine",
          "Custom Limits for users":
            "Limite personnalisée pour les utilisateurs",
          "Add Special Limitations": "Limite d'ajout spéciale",
          "Vehicle Add Limit": "Limite d'ajout de véhicule",
          "Instructor Add Limit": "Limite d'instructeur",
          Value: "Valeur",
          "Add Record": "Ajouter une ligne",
          Add: "Ajouter",
          ///////////////// LOGIN PAGE //////////////////
          "Please input a valid E-mail!": "Veuillez saisir un e-mail valide!",
          "Please input your Password!": "Veuillez saisir votre mot de passe!",

          "Error from sever": "Erreur du serveur",
          "Car Rental Agent": "Agent de location de voitures",

          "Average Rating": "Moyenne des avis",
          Count: "Compte",

          "Rating Date": "Date de notation",
          Rating: "Notation",
          "View Details": "Voir les détails",
          CarRentalAgent: "Agentdelocationdevoitures",
          DrivingSchool: "Auto École",

          Ratings: "Notations",

          Submit: "Envoyer",

          Complete: "Compléter",

          "No Comment": "Aucun commentaire",

          MeetupPoint: "Pointde rencontre",

          DateOfBirth: "Datede naissance",
          Yes: "Oui",
          No: "Non",
          "CPF Accept": "CPF Accepté",
          "Search name": "Nom de la recherche",
          "Search Name": "Nom de la recherche",
          "View Vehicle file": "Voir la fiche du véhicule",
          "View Registration file": "Voir le dossier d'inscription",
          "View GreenCard file": "Voir la carte verte",
          "Request Profile Update": "Demander la mise à jour de mon profil",
          "Reason-Information to update": "Raison-Informations à mettre à jour",
          "Your email or password is incorrect!":
            "Ton e-mail ou ton mot de passe est incorrect!",
          "Email is invalid!": "L'email est invalide!",
          "Enter the email address associated with your account and we'll send you a link to reset your password":
            "Entre l'adresse e-mail associée à ton compte et nous t'enverrons un lien pour réinitialiser ton mot de passe",
          "Return to sign in": "Revenir pour se connecter",
          "Reset your password": "Réinitialise ton mot de passe",
          "Update Query Request": "Demande de mise à jour",
          "select meetup": "Sélectionner le point de rencontre",
          "search rating from": "Rechercher la note de",
          "upload image": "Télécharger une image",
          "Are you sure you want to De-activate this User?":
            "Êtes-vous sûr de vouloir désactiver cet utilisateur ?",
          "Are you sure you want to delete this User?":
            "Êtes-vous sûr de vouloir supprimer cet utilisateur ?",
          "All data regarding the user will be deleted!":
            "Toutes les données concernant l'utilisateur seront supprimées !",
          "Last Name": "Nom de famille",
          "Update Meetup Location": "Mettre à jour l'emplacement du Meetup",
          "Are you sure?": "Es-tu sûr?",
          "Select From dropdown to continue":
            "Sélectionnez De la liste déroulante pour continuer",
          items: "Lignes",
        },
      },
    },
    lng: selectedLang ? selectedLang : "fr",
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false,
    },
  });
