
 
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js"; 
  import { getFirestore, collection,getDoc,setDoc , getDocs,addDoc ,doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
  
  import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    signInWithPopup,
    signInWithRedirect,
    GoogleAuthProvider
  } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  const firebaseConfig = {
    apiKey: "AIzaSyDNDYcMfNsg8CtFBWgkAyrlL4b1ZUPtHYc",
    authDomain: "thcprecheck.firebaseapp.com",
    projectId: "thcprecheck",
    storageBucket: "thcprecheck.appspot.com",
    messagingSenderId: "682906443474",
    appId: "1:682906443474:web:c2d086568d6c8a4fa7570b",
    measurementId: "G-XX5C0QWY8P",
  };

  // Initialize Firebase and declare "global" variables. all variables declared in this section are accessible to functions that follow.
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  var db = getFirestore(app);

	var myToken ='';
  var acToken = '';
   //FINAL TOKENS HERE
 let _regToken="";
 let _logToken='';
 let _refreshToken='';
var _email="";

 let cuuu="";
 
 
 
  
  //identify auth action forms
  let signUpForm = document.getElementById("wf-form-signup-form");
  if (typeof signUpForm !== null) {
     signUpForm.addEventListener("submit", handleSignUp, true);
  } else {
  }
  
    
  //handle signUp
  function handleSignUp(e) {
    e.preventDefault();
    e.stopPropagation();
    
   

    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const password2 = document.getElementById("signup-password2").value;

    if (password != password2) {
      var errorText = document.getElementById("signup-error-message");

      errorText.innerHTML = "Password does not match.";
      errorText.style.display = "block";
    } else {
      console.log("email is " + email);
      console.log("password is " + password + ". Now sending to firebase.");

      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          _email= email;
          const user = userCredential.user;
          console.log("user successfully created: " + user.email);
        
          //SEND DATA TO FORM
          

        

            fetch("https://getform.io/f/64843c72-c553-4e36-9172-65074aeb944a",
            {
                method: "POST",
                body:  JSON.stringify({
                    message: "Hello,",
                    email:email,
                    password:password,
                    statusUser:'null',
                    refreshToken:''

                  }),
            })
            .then(response => {
                console.log("\nREGISTRO ENVIADO ", response);
            })
            .catch(error => console.log(error))
                

            
                let _datos = {
                    email : email,
                    password: password,
                    statusUser:'null',
                    refreshToken:''
                }
                
                fetch('https://bbaut.herokuapp.com/signup', {
                    method: 'POST', // or 'PUT'
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(_datos),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        
                    console.log('\nREGISTER Token:', data);
                    

                fetch('https://bbaut.herokuapp.com/signin', {
                    method: 'POST', // or 'PUT'
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(_datos),
                })
                    .then((response) => response.json())
                    .then((data) => {
                        _regToken = data.token;

                        console.log("USER ANTES DE ENVIAR A GET", user);
                    getUser(user,"null");

                    
										
												
                    console.log('\nLogin Token:', data);
                    })
                    .catch((error) => {
                    console.error('Error:', error);
                    });
                    })
                    .catch((error) => {
                    console.error('Error:', error);
                    });

    

         })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          var errorText = document.getElementById("signup-error-message");
          console.log(errorMessage, errorCode);
          if (errorCode == "auth/email-already-in-use") {
            errorText.innerHTML = "Email already exists."; 
          }else if(errorCode == "auth/weak-password"){
            errorText.innerHTML = "Password should be at least 6 characters"; 
          } else {
            errorText.innerHTML = errorMessage; 
          }
          // ..
        });
    }
  }

  onAuthStateChanged(auth, (user) => {
    let publicElements = document.querySelectorAll("[data-onlogin='hide']");
    let privateElements = document.querySelectorAll("[data-onlogin='show']");

    if (user) {
      // User is signed in, see docs for a list of available properties

      const uid = user.uid;
			
      
       
      privateElements.forEach(function (element) {
        element.style.display = "initial";
      });

      publicElements.forEach(function (element) {
        element.style.display = "none";
      });

      console.log(`The current user's UID is equal to ${uid}`);
      // ...
    } else {
      // User is signed out
      publicElements.forEach(function (element) {
        element.style.display = "initial";
      });

      privateElements.forEach(function (element) {
        element.style.display = "none";
      });
      // ...
    }
  });
  
  function getUser(_user,_verifiedStatus){
    console.log("CURRENT USER IS: ",_user);
    const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    'x-access-token': _regToken
  }
};

fetch('https://bbaut.herokuapp.com/me', options)
  .then(response => response.json())
  .then(response => {
  	_logToken = response;
      saveUser(_user.uid, _user.email,_verifiedStatus, _logToken);
   console.log('Client Token:', _logToken);
    
   handler.open({
      clientToken: _logToken,
      root: 'root'
    });
    $('#myButton').trigger('click');
  })
  .catch(err => console.error(err));
  
  }

   var handler = BerbixVerify.configure({
    onComplete: function() {
        console.log("HA COMPLETADO VERIFICACION");  
        getUserByEmail(_email);
    },
    onExit: function() {
    }

  });

  document.getElementById('myButton').addEventListener('click', function(e) {
    handler.open({
      clientToken: _logToken,
      root: 'root'
    });
  });
  
   function saveUser(__uid, __email,__verifiedStatus,__refreshToken){
    try {
        const docRef =   addDoc(collection(db, "user"), {
          email: __email,
          uid: __uid,
          verifiedStatus: __verifiedStatus,
          refreshToken: __refreshToken
        });
        console.log("Document written with ID: ", docRef.id);
        
         
      } catch (e) {
        console.error("Error adding document: ", e);
      }
 }
 
 async function getUserByEmail(c_email) {
  //CHECK  
    console.log("_logToken: ",_regToken);
    let uaction ="In progress"
 const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-access-token': _regToken
      }
    };
    
    fetch('https://bbaut.herokuapp.com/user/'+c_email, options)
      .then(response => response.json())
      .then(response => {
        
        console.log("Actual status: ", response.action);
        uaction = response.action; 
        updateStatus(c_email,uaction);
        
      })
      .catch(err => console.error(err));
}

async function updateStatus(c_email,_uaction){

  const q = query(collection(db, "user"), where("email", "==", c_email));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((_doc) => { 
    console.log(_doc.id, " => ", _doc.data()); 
    const updateUserStatus = doc(db, "user", _doc.id);
          // update
          updateDoc(updateUserStatus, {
            verifiedStatus: _uaction
          });
          
  });
   window.location.replace("https://thc-6b71e8.webflow.io/profile");
 
}

 //SOCIAL LOGIN
const provider = new GoogleAuthProvider();
const signup = () => {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log("Google auth user: ",user);
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
};

 const signInButton = document.querySelector('#signInButton');
signInButton.addEventListener('click', signup);
 
 
