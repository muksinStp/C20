 import Data from "../models/User.js";

  

  class UserController {
      static browse(req, res) {
          const page = parseInt(req.query.page) || 1;
          console.log(`parameter page adalah ${page}`);
          const operation = req.query.operation || "OR";
          console.log("Operation",operation);
          const filter = {
              name: req.query.name,
              height: req.query.height,
              weight: req.query.weight,
              startDate: req.query.startdate,
              endDate: req.query.enddate,
              isMarried: req.query.married === "true" ? 1 : req.query.married === "false" ? 0 : undefined
          };
          console.log(filter);
  
          Data.getAll(page, 5, filter, operation, (err, data, totalPages) => {
              if (err) {
                console.log(err);
                  res.status(500).json({ error: err.message });
                  return;
              }
              console.log("Data", data);
              console.log("Total pages", totalPages);
  
              const query = Object.keys(req.query).reduce((result, key) => {
                  if (key !== 'page') {
                      result[key] = req.query[key];
                  }
                  return result;
              }, {});
  
              res.render("index", {
                  title: 'BREAD (Browse, Read, Edit, Add, Delete) and Pagination',
                  data,
                  page,
                  filter,
                  operation,
                  totalPages,
                  query: new URLSearchParams(query).toString() // serialisasi query
              });
              
          });
      }
  
    static add(req, res) {
      if (req.method === "GET") {
        console.log("Request method is GET");
        res.render("add", { title: 'Tambah Pengguna', user: null }); // Mengirim title dan user null untuk form kosong
      } else { // ** POST
        console.log("Request method is POST"); 
        console.log("Request body:", req.body);
        Data.add(req.body, (err) => {
          if (err) {
            console.error("Error adding data:", err);
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("Data added successfully");
          res.redirect("/");
        });
      }
    }

    static edit(req, res) {
      if (req.method === "GET") {
        console.log("Request method is GET"); 
        console.log("Request params ID:", req.params.id);
        Data.getById(req.params.id, (err, user) => { 
          if (err) {
            console.error("Error getting data by ID:", err);
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("User data:", user);
          res.render("edit", { title: 'BREAD (Browse, Read, Edit, Add, Delete) and Pagination', user }); // Mengirim title dan user
        });
      } else {
        console.log("Request method is POST"); 
        console.log("Request params ID:", req.params.id); 
        console.log("Request body:", req.body);
        Data.update(req.params.id, req.body, (err) => {
  
          if (err) {
            console.error("Error updating data:", err);
            res.status(500).json({ error: err.message });
            return;
          }
          console.log("Data updated successfully");
          res.redirect("/");
        });
      }
    }

    static delete(req, res) {
      console.log("Request method is DELETE"); 
      console.log("Request params ID:", req.params.id);
      Data.delete(req.params.id, (err) => {
        if (err) {
          console.error("Error deleting data:", err);
          res.status(500).json({ error: err.message });
          return;
        }
        console.log("Data deleted successfully");
        res.redirect("/");
      });
    }
}  
export default UserController;
