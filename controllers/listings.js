const Listing = require("../models/Listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req , res)=>{
    
    const allListing =  await Listing.find({});
    res.render("listings/index.ejs" , {allListing} );
   
}

module.exports.newListing =  async  (req,res,next)=>{

 let responce =  await geocodingClient.forwardGeocode({
          query: req.body.Listing.location,
        limit: 1
      })
        .send()
      
      

    let url = req.file.path;
    let filename = req.file.filename;

    const new_Listing = new Listing(req.body.Listing);
    new_Listing.owner = req.user._id;
    new_Listing.image = {url , filename};
    new_Listing.geometry = responce.body.features[0].geometry
    let sl = await new_Listing.save();
    console.log(sl);
    req.flash("success" , "New Listing Created !");
    res.redirect("/listings");

}

module.exports.newListingForm =  (req ,res)=>{
    res.render("listings/new.ejs");
}

module.exports.showListing =  async (req ,res)=>{

    let { id }= req.params;
    const listing =  await Listing.findById(id).populate({path : "reviews" , populate : { path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    
    res.render("listings/show.ejs" , {listing});
}

module.exports.editForm= async(req,res)=>{
    let{id} = req.params;
    const listing = await Listing.findById(id);
  
    if(!listing){
        req.flash("error" , "Listing you requested for does not exist !");
        res.redirect("/listings");
    }
    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload" , "/upload/h_300,w_250");


    res.render("listings/edit.ejs", {listing , OriginalImageUrl}) ; 
}

module.exports.updateListing=async (req ,res)=>{

    let responce =  await geocodingClient.forwardGeocode({
        query: req.body.Listing.location,
      limit: 1
    })
      .send()

     let {id} = req.params;
  
    let listing =  await  Listing.findByIdAndUpdate(id , req.body.Listing);
     listinng = await  Listing.findByIdAndUpdate(id , {geometry : responce.body.features[0].geometry });
   
     if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
     }
    
   
     req.flash("success" , " Listing Updated !");
     res.redirect(`/listings/${id}`);
 }

 module.exports.destroyListing = async(req ,res)=>{
      let {id} = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success" , "Listing Deleted !");
      res.redirect("/listings");
}