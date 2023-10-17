const {
  getAllContextsFromDb,
  getContextByIdFromDb,
  createContextInDb,
  updateContextInDb,
  deleteContextFromDb,
} = require("../repositories/contexts");
const { setError } = require("../config/error");
const { getSiteByIdFromDb, updateSiteInDb } = require("../repositories/sites");

const getAllContexts = async (req, res, next) => {
  try {
    const { filter } = req.query;
    console.log("hello")
    const Contexts = await getAllContextsFromDb(filter);
    res.status(200).json({ data: Contexts });
  } catch {
    return next(setError(400, "Can't find Contexts hello"));
  }
};

const getContextById = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    const Context = await getContextByIdFromDb(id);
    res.status(200).json({ data: Context });
  } catch {
    return next(setError(400, "Can't find Context"));
  }
};

const createContext = async (req, res, next) => {
  try {
    const ContextObject = { ...req.body };
    const newContext = await createContextInDb(ContextObject);
    res.status(201).json({ data: newContext });
  } catch {
    return next(setError(400, "Can't create Context"));
  }
};

const addContextToSite = async (req, res,next) => {

  try {
    const id = req.params.id
    console.log("checkpoint1",id)
  const newContext = await createContextInDb(req.body)
  console.log("checkpoint2",newContext)
  newContext._site = id
  console.log("checkpoint3",newContext)
  let site = await getSiteByIdFromDb(id)
  console.log("checkpoint4",site)
site._contexts.push(newContext)
const updatedSite = await updateSiteInDb(id, site)
console.log("checkpoint5",updatedSite)
  res.status(201).json(newContext)
  console.log(`New context ${newContext._id} added to site ${updatedSite._id}`)
} catch {
    return next(setError(400, "Can't add context"))
  }
}

const updateContextById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const Context = await updateContextInDb(id, req.body);
    res.status(200).json({ data: Context });
  } catch {
    return next(setError(400, "Can't update Context"));
  }
};

// const deleteContext = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     await deleteContextFromDb(id);
//     res.status(200).json({ data: "Context deleted" });
//   } catch {
//     return next(setError(400, "Can't delete Context"));
//   }
// };

const deleteContext = async (req,res,next)=>{
  try
  {const {siteid} = req.params
  const {contextid} = req.params
  let site = await getSiteByIdFromDb(siteid)
  site._contexts.pull(contextid)
  await updateSiteInDb(siteid, site)
  await deleteContextFromDb(contextid)
  res.status(200).json({data: "Context deleted from Site and Contexts table"})}
catch {
return next(setError(400, "Can't delete Context"))
}
}

module.exports = {
  getAllContexts,
  getContextById,
  createContext,
  addContextToSite,
  updateContextById,
  deleteContext,
};
