pragma solidity ^0.4.24;

contract Bank {

    struct Transaction{
        address to;
        address from;
        uint amount;
    }

    mapping(uint => Transaction) private tranactionID;
    uint[] private _Transactions;
    uint TransactionCount;

    event depositAmount(address to,address _from,uint _amount,uint _transactionID);
    event withDrawAmount(address to,address _from,uint _amount,uint _transactionID);
    event transferAmount(address to,address _from,uint _amount,uint _transactionID);

    mapping(address => uint256) private balanceOf;   // balances, indexed by addresses
    address private owner;

    constructor() public{
        owner = msg.sender;
    }

    function deposit(uint256 _amount) public payable {
        //require(msg.value == amount);
        balanceOf[msg.sender] += _amount;     // adjust the account's balance
        
        uint counter = TransactionCount++;
        Transaction memory transactions;
        transactions.to = msg.sender;
        transactions.from = msg.sender;
        transactions.amount = _amount;
        tranactionID[counter] = transactions;
        _Transactions.push(counter);

        //event will be fire from here
        emit depositAmount(msg.sender,msg.sender,_amount,counter);
        
    }

    function transfer(address _to,uint256 _amount) public payable{
        require(_amount <= balanceOf[msg.sender],"Amount should be less than balance");

        uint counter = TransactionCount++;
        balanceOf[msg.sender] -= _amount;
        balanceOf[_to] += _amount;        
        Transaction memory transactions;
        transactions.to = _to;
        transactions.from = msg.sender;
        transactions.amount = _amount;
        tranactionID[counter] = transactions;
        _Transactions.push(counter);

        emit withDrawAmount(msg.sender,msg.sender,_amount,counter);
    }

    function withdraw(uint256 _amount) public {
        require(_amount <= balanceOf[msg.sender],"Amount should be less than balance");
        balanceOf[msg.sender] -= _amount;
        // if(!msg.sender.send(amount)){
        //     balanceOf[msg.sender] += amount;
        // }else{
        //     //event will be fired from here
        // } 
        uint counter = TransactionCount++;

        Transaction memory transactions;
        transactions.to = msg.sender;
        transactions.from = msg.sender;
        transactions.amount = _amount;
        tranactionID[counter] = transactions;
        _Transactions.push(counter);

        emit transferAmount(msg.sender,msg.sender,_amount,counter);       
    }

    function getBalance() public view returns (uint){
        return balanceOf[msg.sender];
    }

    function getAccountBal(address _owner)public view returns (uint){
        return balanceOf[_owner];
    }

    function getOwner() public view returns(address){
        return owner;
    }

    function getTransactionID()public view returns(uint[]){
        return _Transactions;
    }
}