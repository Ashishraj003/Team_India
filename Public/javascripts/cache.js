
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
        
        this.memoryLatency = 1;
        // this.latency_arr = new Array(this.numberOfSets*this.associativity);
        // this.priority = new Array(this.numberOfSets*this.associativity);//to store priority of each block
        this.cacheLatency = 1;
        this.replacementPolicy=0;
        
    }
    init(){
        this.numberOfSets = this.size/(this.associativity*this.blockSize);// # of sets in cache
        this.fetchMap = new Map();
        this.storage = new Array(this.numberOfSets*this.associativity);//to store blocks..(arr of blocks)
        for(let i = 0; i < this.numberOfSets*this.associativity; i++)
        {
            this.storage[i] = -1;
        }
        this.acceses=0;
        this.misses=0;

    }
    LRU_Policy(val)
    {
        
        val=this.#blockNum(val);//assigning it its block number
        let setNumber = val%this.numberOfSets; 
        this.fetchMap[this.storage[setNumber*this.associativity]] = undefined;//putting the LRU block to undefined
        //since it is evicted so next time the cpu requests this block(the lru block) the fetchmap should say its not there
        for(let i = 1; i < this.associativity; i++)//iterating over the set and creating space for MRU by shifting each block left
        {
            this.storage[ setNumber*this.associativity + i - 1] = this.storage[ setNumber*this.associativity + i];
        }
        this.fetchMap[val]=1;//telling the Cache that this block exits in cache...
        this.storage[ (setNumber+1)*this.associativity - 1] = val+1;//assigning the MRU part of cache to curr block index+1
        //remember our cache has this design LRU ------ MRU ie LRU block is at left most and MRU rightMost in a set.
    }
    RR_Policy(val){//random replacement policy...
        let setNumber = this.#blockNum(val)%this.numberOfSets; 
        let ran = Math.floor(Math.random() * (this.associativity));//gives an index between 0 to associativity -1...
        this.fetchMap[this.storage[ (setNumber)*this.associativity + ran]] = undefined;//randomly evicting the block
        this.storage[ (setNumber)*this.associativity + ran] = this.#blockNum(val);//assigning that specific random location to new incoming block
        this.fetchMap[this.#blockNum(val)]=1;// telling the cache that the block exists...
    }
    
    UpdateLRU(index)
    {
        let old=this.#blockNum(index);
        let setNumber = this.#blockNum(index)%this.numberOfSets;
        let flag = 0;
        let firstBlockIndex = setNumber*this.associativity;
        // (LeftMost)LRU......MRU(rightMost)
        for(let i = 0; i < this.associativity; i++)
        {
            if(this.storage[firstBlockIndex + i]==-1)//means the block was already MRU
            {
                this.storage[ firstBlockIndex+i-1]=old+1; //so nothing to do....
                return ;
            }
            if(flag == 1){
                this.storage[ firstBlockIndex + i -1] = this.storage[ firstBlockIndex + i];
            }
            else if(this.storage[ firstBlockIndex + i ]== old+1){
                flag = 1;
                if(this.storage[firstBlockIndex + i+1]==-1)
                {
                    return;//already mru so nothing to do
                }
            }
        }
        this.storage[ (setNumber+1)*this.associativity-1]=old+1;
    }


    fetchVal(index)//returns latency
    {
        this.acceses++;
        let blockNumber = this.#blockNum(index); // gives the blockNumber to fetch from...

        if(this.fetchMap[blockNumber]==undefined)  //block present or not.
        {
            // this.storeVal(index); 
            //we will store val at the end of 100 cycles!! \ (code is there in Core class(for storing val...))
            // not just now since the other processor should not see the value appearing in cache before 100cycles otherwise inconsistency will come in.
            this.misses++;
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
        
        // initially mai hi block size /4 karna hoga input le0ne ke samay.( because memory is in multiples of 4(addresses) same scheme followed for pc... 4 bytes in 1 word)
        // i can get a pc or a memory address  in val
        // this.acceses++;
        let block_size = this.blockSize/4;
        let wordNumber = index/4;//just to show that it does'nt matter even if we do val/block_size
        let setNumber = this.#blockNum(index)%this.numberOfSets;
        let firstBlockIndex = setNumber*this.associativity;
        if(this.fetchMap[this.#blockNum(index)]!=undefined){
            return;
        }
        this.misses++;
        for(let i = 0; i < this.associativity; i++)//7p
        {
            if(this.storage[ firstBlockIndex + i ]==-1)//under Review...
            {
                this.fetchMap[this.#blockNum(index)]=1;
                this.storage[ firstBlockIndex + i ] = this.#blockNum(index)+1;
                return this.memoryLatency;
            }
        }
        //it comes here if it doesnt return ... ie it didnt find any free space....
        //time to use cache replacement policy..
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
    #blockNum(index){
        return Math.floor(index/(this.blockSize));
    }
}

export default Cache;