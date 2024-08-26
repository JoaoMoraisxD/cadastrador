
let submitButton = document.getElementById('submitButton');

submitButton.addEventListener('click', async () => { 
   let nomeUsuario = document.getElementsByClassName('user')[0].value;
   let senhaDb = document.getElementsByClassName('senhaDb')[0].value;
   if(nomeUsuario != null && senhaDb != null){
      let crypSenhaDb = CryptoJS.AES.encrypt(senhaDb, 'sua-chave-secreta').toString();

      let response = await axios.post('http://localhost:3001/login', {
         nomeUsuario: nomeUsuario,
         senhaDb: crypSenhaDb
         })

         Swal.fire({
            title: 'Sucesso',
            text: 'Login no banco efetuado com sucesso!',
            icon: 'success'
        });
      
      console.log(response)

      const token = response.data.token;
      localStorage.setItem('authToken', token);

      window.location.href = 'http://127.0.0.1:5500/frontend/cadastrador.html';
   }else {

      Swal.fire({
         icon: 'error',
         title: 'Oops...',
         text: 'Algum campo não foi preenchido. \n Tente Novamente'
     });
   }
 })
