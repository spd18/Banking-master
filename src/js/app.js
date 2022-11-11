App = {
  web3Provider: null,
  contracts: {},
  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function () {

    $.getJSON("Bank.json", function (Bank) {
      App.contracts.Bank = TruffleContract(Bank);
      App.contracts.Bank.setProvider(App.web3Provider);
      //App.listenForEvents();
      console.log("Bank is iniialized");
      return App.initAccounts();
    });
  },

  listenForEvents: function () {
    // App.contracts.Bank.deployed().then(function(instance){
    //   instance.depositAmount({},{
    //     fromBlock:0,
    //     toBlock:'latest'
    //   }).watch(function(error,result){
    //       console.log(result);
    //       alert("Deposit is mode");
    //     }); 
    // });

    // App.contracts.Bank.deployed().then(function(instance){
    //   instance.withDrawAmount({},{
    //     fromBlock:0,
    //     toBlock:'latest'
    //   }).watch(function(error,result){
    //       console.log(result);
    //       alert("Withdrawal is mode");
    //     }); 
    // });

    // App.contracts.Bank.deployed().then(function(instance){
    //   instance.transferAmount({},{
    //     fromBlock:0,
    //     toBlock:'latest'
    //   }).watch(function(error,result){
    //       console.log(result);
    //       alert("Transfer of balance is made");
    //     }); 
    // });
  },

  initAccounts: function () {
    var acc;
    web3.eth.getCoinbase(function (err, account) {
      if (err === null) {
        App.account = account;
        acc = account;
        web3.eth.getBalance(account, (err, bal) => {
          if (!err) {
            balance = web3.fromWei(bal, 'ether').toNumber();
            console.log("Your Account: " + App.account);
            console.log("Balance = " + balance);
            console.log("Balance = " + bal);
          }
          else {
            console.error(err);
          }
        });
      }
    });
  },

  transferAmt:function(){
    var accountNo = $("#hexAccount").val();
    var amount = $("#transferAmount").val();
    var owner = $("#myHexAccount").val();
    App.contracts.Bank.deployed().then(function(instance) {   
       var bank = instance;
       bank.transfer(accountNo,amount,{from:owner});
      console.log(owner + "has transfer "+amount+" amount to "+ accountNo);
    });
  },


  getBalance: function () {
    var bank;
    owner = $('#myHexAccount').val();
    App.contracts.Bank.deployed().then(function (instance) {
      bank = instance;
      bank.getAccountBal(owner).then(function(error,result){
        if(!error){
         obj = JSON.parse(result);
         console.log("OK :"+obj.s);
        }
        else{
          console.log("OKERR :"+error);
          $("#hexAccountBalace").html("Your aailable balance is "+error);
        }
      });
    });

   
  },

  deposit: function () {
    var bank;
    var owner = $('#hexAccount').val();
    var amount = $('#diposit_Amount').val();

    App.contracts.Bank.deployed().then(function (instance) {
      bank = instance;
      bank.deposit(amount,{ from: owner });
      console.log(owner + "has deposited "+ amount);
    });
  },

  withdraw: function () {
    var bank;
    var owner = $('#hexAccount').val();
    var amount = $('#withdraw_Amount').val();

    App.contracts.Bank.deployed().then(function (instance) {
      bank = instance;
      bank.withdraw(amount,{ from: owner });
      console.log(owner + "has deposited "+ amount);
    });
  },


  //nominal
  addNewOwner:function(){
    $('#hexAccount').val('');
  }

};

$(function () {
  $(window).load(function () {
    App.init();
  });
});