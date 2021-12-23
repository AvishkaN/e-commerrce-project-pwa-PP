import {createSlice} from '@reduxjs/toolkit';
import { addDoc, collection, doc, setDoc,getDocs ,query, where, getDoc, updateDoc, arrayUnion, arrayRemove} from "@firebase/firestore"; 
import { db } from "../../firebase"; 

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "@firebase/storage";



export const ProductSlice=createSlice({
    name:"Product",
    initialState:{
        Products:[], 
        Wishlists:[], 
        loading: false,
        hasErrors: false,
        error: null,
        clickedProduct:null,
    },
    reducers:{

        loadingProducts:(state)=>{   
            console.log(`loadingProducts....`); 
            console.log(`@@@@@`);

            state.loading=true; 
        },
        loadProductsSucsses:(state,action)=>{   
            state.Products=action.payload; 
            state.loading=false; 
            state.hasErrors=false; 
            
        },
        loadWishListsSucsses:(state,action)=>{   
            state.Wishlists=action.payload; 
            
        },
        
        LoadProductError:(state,error)=>{   
            state.hasErrors=true; 
            state.loading=false; 
            state.error=error; 

        },
        clickedProductFN:(state,action)=>{   
            state.clickedProduct=action.payload; 

        },

        curUserIsFavouritedFN:(state,action)=>{
            const {products,userEmail}=action.payload;

            let newArr=[...products];

            console.log(`🖥🖥🖥`);
            console.log(products,userEmail);

            const x=newArr.filter((product,i)=>{
                console.log(i);

                if(product.data.favUsers.includes(userEmail)){
                    // const obj=newArr[i].thisUserFav=true;
                    newArr[i]={...newArr[i],thisUserFav:true}
                }
            
            });

            state.Products=newArr; 


            console.log(newArr);



        }

    }
});



export const {loadingProducts,loadProductsSucsses,LoadProductError,clickedProductFN,curUserIsFavouritedFN,loadWishListsSucsses} =ProductSlice.actions; 

//selectors
export const selectProducts=(state)=>state.products;

export default ProductSlice.reducer;





 export  const LoadProducts=async (dispatch=null,userEmail)=>{
     dispatch(loadingProducts());
    try{

        const querySnapshot = await getDocs(collection(db, "products"));

        console.log(`1`);

        let data=[];
        
       querySnapshot.forEach((doc) => {
        data.push({  
             id:doc.id,
            data:doc.data() 
        });
        });  
        console.log(data);
        dispatch(loadProductsSucsses(data));

        // add wishListPage

       const wishlistDataArr= data.filter(product=>product.data.favUsers.includes(userEmail))
        console.log(userEmail);
        console.log(wishlistDataArr);

        if(wishlistDataArr){
            dispatch(loadWishListsSucsses(wishlistDataArr))
        }

    }catch(err){

    }

};


 export  const AddProduct=async (dispatch=null,data={})=>{
    try{

        // timeStamp:firebase.firestore.FieldValue.serverTimestamp(), 
        const docRef = await addDoc(collection(db, "products"), {...data,timeStamp:new Date().getTime()} ); 
        console.log(docRef);
        
    }catch(err){
        console.log(err);
    }

};


 export  const UploadFile=async (dispatch=null,file,setImgUrl)=>{

    let fileUrl;

    try{

                const storage = getStorage();
                const storageRef = ref(storage, `images/${Math.random()} ${file.name}`);

                const uploadTask = uploadBytesResumable(storageRef, file);

                // Register three observers:
                // 1. 'state_changed' observer, called any time the state changes
                // 2. Error observer, called on failure
                // 3. Completion observer, called on successful completion

              await  uploadTask.on('state_changed', 
                (snapshot) => {
                    // Observe state change events such as progress, pause, and resume
                    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                  
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                    switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    }
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                }, 
               async () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                   await getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL);
                        fileUrl=downloadURL; 
                        setImgUrl(downloadURL);
                    });
                }
                );


                const y=await fileUrl;
                return fileUrl;
        
    }catch(err){
     
    }

};




export  const filterProducts=async (dispatch=null)=>{
    // dispatch(loadingProducts());
   try{
    console.log(`filtering...`);

        const q = query(collection(db, "products"), where("price", "==", "250.69"));

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        });

        // console.log(`💗`,querySnapshot[0]);
        // console.log(`💗`,querySnapshot);
    //     console.log(`💗`,querySnapshot._snapshot.docChanges);
    //     console.log(`💗`,querySnapshot._snapshot.docChanges[1].doc.data.value.mapValue.fields);
    //     // console.log(`💗`,querySnapshot._snapshot.docChanges[2].doc.data.value.mapValue.fields);
    //     // console.log(`💗`,typeof querySnapshot);
    //     // console.log(`💗`);

    //  querySnapshot._snapshot.forEach.map((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, "💗 => ", doc.data());
    //     });



   }catch(err){

   }

};


export  const findProductById=async (dispatch=null,id)=>{
   try{

    
    const snap = await getDoc(doc(db, 'products', id))


    return snap.data();

   }catch(err){

   }

};



//  helper function
// const curUserIsFavourited=()=>{

// };



export  const AddRemoveFav=async (dispatch=null,id,userEmail)=>{
    try{
        
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        
        
        const userIsExists=docSnap.data()?.favUsers.filter(user=>user==userEmail);


        if(userIsExists.length){ // userIsExists -- > delete

            const documentt = doc(db, "products", id);

            await updateDoc(documentt, {
                favUsers: arrayRemove(userEmail)
            });

            LoadProducts(dispatch,userEmail);

        }

        if(userIsExists.length==0){  // user is doesn't exists  --> add new 

            const documentt = doc(db, "products", id);
    
            // Atomically add a new region to the "regions" array field.
            await updateDoc(documentt, {
                favUsers: arrayUnion(userEmail)
            });

            LoadProducts(dispatch,userEmail);

        }

        
    }catch(err){
    }

};