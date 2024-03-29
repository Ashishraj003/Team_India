class Cache{
    //pc should be stored for instructions... 
    //instructions should be stored  as follows:
    // (int(floor(pc/blocksize))/4) % (#sets) to  .. block should be fetchedwhere k is size of each block in memory
    //let it be M way associative -> cache storage spot (int(floor(pc/blocksize))) % M;
    //variables : M, k, cache size is variable...

    constructor(){
        this.size = 2048;//2kb
        this.associativity = 4;
        this.blockSize = 8;
        this.numberOfSets = this.size/(this.associativity*this.blockSize);
        this.fetchMap ={};
        this.storage = new Array(this.numberOfSets*this.associativity);
        for(let i = 0; i < this.numberOfSets*this.associativity; i++)
        {
            this.storage[i] = 0;
        }
    }
    fetchVal(val)
    {
        return this.fetchMap[Math.floor(val/(this.blockSize))]; 
        //this only returns true and false and we are fetching from memory seperately
    }

    storeVal(val)
    {
        // initially mai hi block size /4 karna hoga input lene ke samay.
        let setNumber = Math.floor(val/(this.blockSize))%this.numberOfSets;
        for(let i = 0; i < this.associativity; i++)
        {
            if(this.storage[setNumber+i]==0)
            {
                this.storage[setNumber+i] = Math.floor(val/(this.blockSize));
                this.fetchMap[Math.floor(val/(this.blockSize))]= true;
                return;
            }
        }
        lru(setNumber);   
    }
    
    storeInstruction()
    {

    }
    lru(setNumber)
    {
        let min = 0;
        for(let i = 0; i < this.associativity; i++)
        {
            if()
            {
                min = i;
            }
        }
        this.storage[setNumber*this.associativity+min] = 0;
    }
}
