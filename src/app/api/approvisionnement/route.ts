const ModelApprovisionnement = require("../Models/Approvisionnement");
const ModelStockFinal = require("../Models/StockFinal");
const asyncLab = require("async");
const moment = require("moment");
const ModelSituationStock = require("../Models/SituationStock");

const AddApprovisionnement = (req, res) => {
  try {
    const { idShop, name } = req.user;
    const dateSave = new Date(moment().format("YYYY-MM-DD")).getTime();
    const {
      idProduit,
      quantite,
      num_lot,
      prix_achat,
      prix_vente,
      dateFabrication,
      date_peremption,
      fournisseur,
    } = req.body;
    if (
      !idProduit ||
      !prix_achat ||
      !prix_vente ||
      !quantite ||
      !num_lot ||
      !dateFabrication ||
      !date_peremption ||
      !fournisseur
    ) {
      return res.status(201).json("Veuillez renseigner les champs");
    }
    asyncLab.waterfall(
      [
        function (done) {
          ModelStockFinal.findOne({ idProduit }, { quantite: 1 })
            .lean()
            .then((result) => {
              done(null, result);
            })
            .catch(function (error) {
              console.log(error);
              return res.status(201).json(error.message);
            });
        },
        function (product, done) {
          ModelApprovisionnement.create({
            idProduit,
            quantite,
            idShop,
            doby: name,
            num_lot,
            prix_achat,
            prix_vente,
            dateFabrication: new Date(dateFabrication).getTime(),
            dateSave,
            date_peremption: new Date(date_peremption).getTime(),
            fournisseur,
            ancien_qte: product ? product.quantite : 0,
          })
            .then((result) => {
              done(null, result, product);
            })
            .catch(function (error) {
              return res.status(201).json(error.message);
            });
        },
        function (created, product, done) {
          ModelSituationStock.findOne({
            idProduit: created.idProduit,
            date: dateSave,
          }).then((result) => {
            if (result) {
              ModelSituationStock.findOneAndUpdate(
                {
                  idProduit: created.idProduit,
                  date: dateSave,
                },
                {
                  $inc: {
                    entrer: created.quantite,
                    solde: created.quantite,
                  },
                }
              ).then((response) => {
                done(created);
              });
            } else {
              ModelSituationStock.create({
                idProduit: created.idProduit,
                date: dateSave,
                initiale: product?.quantite || quantite,
                entrer: quantite,
                sortie: 0,
                solde: (product?.quantite ? product?.quantite : 0) + quantite,
              }).then((response) => {
                done(created);
              });
            }
          });
        },
      ],
      function (product) {
        if (product) {
          return res.status(200).json(product);
        } else {
          return res.status(201).json(product);
        }
      }
    );
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
const ReadApprovisionnement = (req, res) => {
  try {
    const { date1, date2 } = req.body;
    const { idShop } = req.user;

    const firstDate = new Date(date1).getTime();
    const secondDate = new Date(date2).getTime();

    const content = [
      {
        $lookup: {
          from: "produits",
          localField: "idProduit",
          foreignField: "idProduit",
          as: "produit",
        },
      },
      { $unwind: "$produit" },
      {
        $lookup: {
          from: "unites",
          localField: "produit.idUnite",
          foreignField: "idUnite",
          as: "unite",
        },
      },
      {
        $lookup: {
          from: "fourniss_clients",
          localField: "fournisseur",
          foreignField: "id",
          as: "fournisseurs",
        },
      },
      { $unwind: "$fournisseurs" },
      { $unwind: "$produit" },
      { $unwind: "$unite" },

      {
        $project: {
          quantite: 1,
          doby: 1,
          num_lot: 1,
          dateFabrication: 1,
          dateSave: 1,
          date_peremption: 1,
          fournisseur: "$fournisseurs.name",
          ancien_qte: 1,
          produit: "$produit.produit",
          unite: "$unite.unite",
          prix_achat: 1,
          prix_vente: 1,
        },
      },
    ];

    let aggregation =
      date1 && date2
        ? [
            {
              $match: {
                dateSave: { $gte: firstDate, $lte: secondDate },
                idShop,
              },
            },
            ...content,
          ]
        : [
            {
              $match: {
                idShop,
              },
            },
            ...content,
          ];

    ModelApprovisionnement.aggregate(aggregation).then((result) => {
      return res.status(200).json(result.reverse());
    });
  } catch (error) {
    return res.status(201).json(error.message);
  }
};
module.exports = { AddApprovisionnement, ReadApprovisionnement };
