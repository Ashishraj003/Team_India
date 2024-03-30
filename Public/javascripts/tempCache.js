var PWF = 
{
    L1: new Array(8).fill(0), //3D array[set][block][offset]
    L2: new Array(32).fill(0), //3D array[set][block][offset]
    L1Tags: new Array(4).fill(0), //2D array[set][block]
    L2Tags: new Array(8).fill(0), //2D array[set][block]
    L1Priority: new Array(4).fill(0), //2D array[set][block]
    L2Priority: new Array(8).fill(0), //2D array[set][block]
    L1Size: 16,
    L1BlockSize: 4,
    L1Associativity: 1,
    L2Size: 128,
    L2BlockSize: 8,
    L2Associativity: 8,
    L1Latency: 1,
    L2Latency: 2,
    MMLatency: 10,
    isIdealCase: false,
};
PWF.updateCacheSettings = (l1_size, l1_block, l1_asso, l2_size, l2_block, l2_asso, l1_latency, l2_latency, mm_latency, idealcase) => {
    PWF.L1Size = l1_size
    PWF.L1BlockSize = l1_block
    PWF.L1Associativity = l1_asso
    PWF.L2Size = l2_size
    PWF.L2BlockSize = l2_block
    PWF.L2Associativity = l2_asso
    PWF.L1Latency = l1_latency
    PWF.L2Latency = l2_latency
    PWF.MMLatency = mm_latency
    PWF.isIdealCase = idealcase
}
PWF.initializeCache = () => {
    //initializing data array for L1
    let l1_block_size = PWF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWF.L1Associativity   //no of blocks in a set
    let l1_sets = PWF.L1Size/(PWF.L1Associativity*PWF.L1BlockSize) //total number of sets in the cache
    PWF.L1 = matrix().resize([l1_sets,l1_blocks,l1_block_size])

    //initializing tags and priority for L1
    PWF.L1Tags = matrix().resize([l1_sets,l1_blocks], -1)
    PWF.L1Priority = matrix().resize([l1_sets,l1_blocks], -1)

    //initializing data array for L2
    let l2_block_size = PWF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWF.L2Associativity   //no of blocks in a set
    let l2_sets = PWF.L2Size/(PWF.L2Associativity*PWF.L2BlockSize) //total number of sets in the cache
    PWF.L2 = matrix().resize([l2_sets,l2_blocks,l2_block_size])

    //initializing tags and priority for L2
    PWF.L2Tags = matrix().resize([l2_sets,l2_blocks], -1)
    PWF.L2Priority = matrix().resize([l2_sets,l2_blocks], -1)
}
PWF.updateCache = (wordAddress, store) =>
{
    //most recently used will have priority value 0, least recently used will have priority value [no of blocks in a set-1]
    let index = (wordAddress-268500992)/4
    let data = PWF.memory[index]
    //search L1, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L1
    let l1_block_size = PWF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWF.L1Associativity   //no of blocks in a set
    let l1_sets = PWF.L1Size/(PWF.L1Associativity*PWF.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    let l1_flag = 0
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            //search successful, found in this set
            l1_flag=1
            let currentP1 = PWF.L1Priority.get([l1set_index,i])
            if(PWF.L1Priority.get([l1set_index,i]) != 0)
            {
                for(let j=0; j<l1_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(PWF.L1Priority.get([l1set_index,j]) != -1 && PWF.L1Priority.get([l1set_index,j])<currentP1)
                    {
                        let t = PWF.L1Priority.get([l1set_index,j])
                        PWF.L1Priority.set([l1set_index,j], t+1)
                    }
                }
                PWF.L1Priority.set([l1set_index,i],0)
            }
            else
            {
                //no need to update priorities because it is already the most recently used
            }
            if(store)
            {
                for(let j=0; j<l1_block_size; j++)//parsing through the block and updating L1 data because it is a store
                {
                    let t = l1block_index*l1_block_size
                    PWF.L1.set([l1set_index, i, j], PWF.memory[t+j])
                }
            }
            else
            {
                return
            }
            break
        }
    }
    if(!l1_flag)//if the search was unsuccessful, need to write/overwrite
    {
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(PWF.L1Priority.get([l1set_index,i]) != -1)
            {
                let t = PWF.L1Priority.get([l1set_index,i])
                PWF.L1Priority.set([l1set_index,i], t+1)
            }                
        }
        for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(PWF.L1Priority.get([l1set_index,i]) == -1 || PWF.L1Priority.get([l1set_index,i]) > l1_blocks-1)
            {
                PWF.L1Priority.set([l1set_index,i], 0)
                PWF.L1Tags.set([l1set_index,i], l1block_index)
                for(let j=0; j<l1_block_size; j++)//parsing through the block
                {
                    let t = l1block_index*l1_block_size
                    PWF.L1.set([l1set_index, i, j], PWF.memory[t+j])
                }
                break
            }         
        }
    }
    //***************************** */
    //search L2, if there, change priority of all elements in the set, else find lowest priority position in the set and overwrite in L2
    let l2_block_size = PWF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWF.L2Associativity   //no of blocks in a set
    let l2_sets = PWF.L2Size/(PWF.L2Associativity*PWF.L2BlockSize) //total number of sets in the cache
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    let l2_flag = 0
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            l2_flag=1
            let currentP2 = PWF.L2Priority.get([l2set_index,i])
            if(PWF.L2Priority.get([l2set_index,i]) != 0 && (store || !l1_flag))
            {
                for(let j=0; j<l2_blocks; j++)//parsing through the blocks in the corresponding set and updating priority
                {
                    if(PWF.L2Priority.get([l2set_index,j]) != -1 && PWF.L2Priority.get([l2set_index,j])<currentP2)
                    {
                        let t = PWF.L2Priority.get([l2set_index,j])
                        PWF.L2Priority.set([l2set_index,j], t+1)
                    }
                }
                PWF.L2Priority.set([l2set_index,i],0)
            }
            else
            {
                //no need to update priorities because it is already the most recently used
            }
            if(store)
            {
                for(let j=0; j<l2_block_size; j++)//parsing through the block and updating data because it is a sw
                {
                    let t = l2block_index*l2_block_size
                    PWF.L2.set([l2set_index, i, j], PWF.memory[t+j])
                }
            }
            break
        }
    }
    if(!l2_flag)//if the search was unsuccessful, need to write/overwrite
    {
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set to update remaining priorities
        {
            if(PWF.L2Priority.get([l2set_index,i]) != -1)
            {
                let t = PWF.L2Priority.get([l2set_index,i])
                PWF.L2Priority.set([l2set_index,i], t+1)
            }                
        }
        for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
        {
            if(PWF.L2Priority.get([l2set_index,i]) == -1 || PWF.L2Priority.get([l2set_index,i]) > l2_blocks-1)
            {
                PWF.L2Priority.set([l2set_index,i], 0)
                PWF.L2Tags.set([l2set_index,i], l2block_index)
                for(let j=0; j<l2_block_size; j++)//parsing through the block
                {
                    let t = l2block_index*l2_block_size
                    PWF.L2.set([l2set_index, i, j], PWF.memory[t+j])
                }
                break
            }    
        }
    }
} 
PWF.stallTime = (wordAddress) =>
{
    //this function takes an address, check L1, L2 and returns number of stall cycles accordingly
    //if hit in L1, return L1Latency
    //else if hit in L2, return L2Latency +L1Latency
    //else return MMLatency + L1Latency +L2Latency
    let index = (wordAddress-268500992)/4
    let l1_block_size = PWF.L1BlockSize/4 //no of words in a block
    let l1_blocks = PWF.L1Associativity   //no of blocks in a set
    let l1_sets = PWF.L1Size/(PWF.L1Associativity*PWF.L1BlockSize) //total number of sets in the cache
    let l1block_index = Math.floor(index/l1_block_size) //this is the value of address to be searched/stored in the tag array
    let l1set_index = l1block_index%l1_sets  //this is the set number which this address belongs to
    for(let i=0; i<l1_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L1Tags.get([l1set_index,i]) == l1block_index)
        {
            return PWF.L1Latency
        }
    }
    let l2_block_size = PWF.L2BlockSize/4 //no of words in a block
    let l2_blocks = PWF.L2Associativity   //no of blocks in a set
    let l2_sets = PWF.L2Size/(PWF.L2Associativity*PWF.L2BlockSize) //total number of sets in the cache
    let l2block_index = Math.floor(index/l2_block_size) //this is the value of address to be searched/stored in the tag array
    let l2set_index = l2block_index%l2_sets  //this is the set number which this address belongs to
    for(let i=0; i<l2_blocks; i++)//parsing through the blocks in the corresponding set
    {
        if(PWF.L2Tags.get([l2set_index,i]) == l2block_index)
        {
            return PWF.L2Latency + PWF.L1Latency
        }
    }
    return PWF.MMLatency + PWF.L2Latency + PWF.L1Latency
}
PWF.setInitialMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0 //this method is called while initialising the main memory during preprocessing stage
    let index = (wordAddress-268500992)/4
    PWF.memory[index]=value
}
PWF.setMemory = (wordAddress, value) =>
{
    //shifting 0x10010000 to 0
    let index = (wordAddress-268500992)/4
    PWF.memory[index]=value
    PWF.updateCache(wordAddress, true) 

}
PWF.getMemory = (wordAddress) =>
{
    let index = (wordAddress-268500992)/4
    PWF.updateCache(wordAddress, false) 
    return PWF.memory[index]
}