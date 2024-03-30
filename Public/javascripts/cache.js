
class Cache{
    //pc should be stored for instructions... 
    //instructions should be stored  as follows:
    // (int(floor(pc/blocksize))/4) % (#sets) to  .. block should be fetchedwhere k is size of each block in memory
    //let it be M way associative -> cache storage spot (int(floor(pc/blocksize))) % M;
    //variables : M, k, cache size is variable...

    constructor(){
        this.size = 2048;//2kb total cache size
        this.associativity = 32;// 4 blocks in 1 set
        this.blockSize = 8; // 8 bytes in 1 block (2 words)....
        this.numberOfSets = this.size/(this.associativity*this.blockSize);// # of sets in cache
        this.fetchMap = new Map();
        this.memoryLatency = 1;
        this.storage = new Array(this.numberOfSets*this.associativity);//to store blocks..(arr of blocks)
        // this.priority = new Array(this.numberOfSets*this.associativity);//to store priority of each block
        this.cacheLatency = 1;
        this.replacementPolicy=0;
        for(let i = 0; i < this.numberOfSets*this.associativity; i++)
        {
            this.storage[i] = 0;
        }
    }
    check(){
        console.log(this.storage);
    }
    LRU_Policy(val)
    {
        
        val=this.#firstblock(val); //val=this.#firstblocj(index) of fetchVal
        let setNumber = this.#firstblock(val)%this.numberOfSets; 
        this.fetchMap[this.storage[setNumber*this.associativity]] = undefined;
        for(let i = 1; i < this.associativity; i++)
        {
            this.storage[ setNumber*this.associativity + i - 1] = this.storage[ setNumber*this.associativity + i];
        }
        this.fetchMap[val]=1;
        this.storage[ (setNumber+1)*this.associativity - 1] = val+1;

    }
    RR_Policy(val){
        let ran = Math.floor(Math.random() * (this.associativity));
        this.fetchMap[this.storage[ (setNumber)*this.associativity + ran]] = undefined;
        this.storage[ (setNumber)*this.associativity + ran] = this.#firstblock(val);
        this.fetchMap[this.#firstblock(val)]=1;
    }
    
    UpdateLRU(index)
    {
        debugger;
        let old=this.#firstblock(index);
        let setNumber = this.#firstblock(index)%this.numberOfSets;
        let flag = 0;
        // this.fetchMap[this.#firstblock(index)]=1;
        for(let i = 0; i < this.associativity; i++)
        {
            if(this.storage[setNumber*this.associativity + i]==0)
            {
                this.storage[ setNumber*this.associativity+i-1]=old+1;
                return ;
            }
            if(flag == 1){
                this.storage[ setNumber*this.associativity + i -1] = this.storage[ setNumber*this.associativity + i];
            }
            else if(this.storage[ setNumber*this.associativity + i ]== old+1){
                flag = 1;
            }
        }
        this.storage[ (setNumber+1)*this.associativity-1]=old+1;
    }


    fetchVal(index)//returns clock cycles (stalls)
    {
        debugger;
        let val = index/4;// as pc / memory address are multiples of 4 (pc will be sent from back as pc*4)
        let blockNumber = Math.floor(index/(this.blockSize)); // gives the blockNumber to fetch from...

        if(this.fetchMap[blockNumber]==undefined)  //block present or not.
        {
            this.storeVal(index);     
            return this.memoryLatency;
        }
        else
        {
            if(this.replacementPolicy==0)
            {
                this.UpdateLRU(index);
            }
            return this.cacheLatency;
        }
        //this only returns true and false and we are fetching from memory seperately
    }

    storeVal(index)
    {
        // initially mai hi block size /4 karna hoga input lene ke samay.( because memory is in multiples of 4(addresses) same scheme followed for pc... 4 bytes in 1 word)
        // i can get a pc or a memory address  in val
        let block_size = this.blockSize/4;
        let wordNumber = index/4;//just to show that it does'nt matter even if we do val/block_size
        let setNumber = this.#firstblock(index)%this.numberOfSets;
        for(let i = 0; i < this.associativity; i++)//7p
        {
            if(this.storage[ setNumber*this.associativity + i ]==0)//under Review...
            {
                this.fetchMap[this.#firstblock(index)]=1;
                this.storage[ setNumber*this.associativity + i ] = this.#firstblock(index)+1;
                return this.memoryLatency;
            }
        }
        if(this.replacementPolicy==0)
        {
            this.LRU_Policy(index);   
        }
        else
        {
            this.RR_Policy(index);   
        }
        return this.memoryLatency;
    }
    storeResult(setNumber,index)
    {
        this.storage[ setNumber*this.associativity + i ] = true;//sets that block to be occupied....
        let block_size = this.blockSize/4;
        let blockNumber = Math.floor(index/block_size);
        //block_size = this.blockSize/4; which gives number of words we can store in each block..
        // so we make sure we store nearby pc/ address too!! (spacial locality)
        for(let i=0;i<block_size;i++)
        {
            this.fetchMap[blockNumber+i] = index+i;
        }
    }
    #firstblock(index){
        return Math.floor(index/(this.blockSize));
    }
}
export default Cache;