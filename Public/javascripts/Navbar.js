import { setValue1, setValue2 } from "./editor.js";


const bubble = document.querySelector(".bubble");
const selection = document.querySelector(".selection");


//

bubble.addEventListener("click", () => {
    setValue1(`#Bubble Sort


    #for(int i=0;i<n-1;i++)
    #{
    #    for(int j=0;j<(n-1-i);j++)
    #    {
    #        if(arr[j]>arr[j+1])
    #        {
    #            swap(arr[j],arr[j+1]);
    #        }
    #    }
    #}
    .data
    arr: .zero 20
    base: .word 0
    
    .text 
    lw x16 base #intitalizing base address of array to x16
    addi x6 x0 0 #initializing x6 to 0
    addi x7 x0 0 #initializing x7 to 0
    
    #-----------initialization of arr with decending values----------------
    addi x19 x0 20 # a register x19 storing 20
    LoopInitialization:
    sw x19 0(x16) # storing value of x19 in address pointed by x16
    addi x16 x16 4 #updating x16 to move to next byte
    addi x19 x19 -1 # decreasing x19 register by 1
    bne x19 x0 LoopInitialization # checking if I reached x19 ==0
    #-----------Done----------------------------------
    addi x3, x0, 19 # x3 is storing 19
    j Main #jumping to main
    
    For:
        lw x16 base # i is x2
        add x2, x0, x6 # i begining from 0 i is x2
        addi x6 ,x6, 1 # incresed incrementor by 1 (i++)
        beq x2, x3, AfterSortingIsComplete #goes here if sorting is over
        addi x7 x0 0 #above instruction checks if i<19 since 19==(x3)
        # internal for loop
        InternalFor:
        add x4 ,x0 ,x7 # added j=0 incrementor is x7
        addi x7 ,x7 ,1 #j++
        sub x5 ,x3 ,x2 # (j<19-i x3->19 i -> x2) stored in x5
        beq x4 ,x5 ,For #checking if internal for loop is over
        lw x15 ,0(x16)  #(it moves to for loop to execute new cycle)
        lw x17 ,4(x16)  #if x4 !=x5 then we move to swapping so we load
        blt x17,x15 IF #current and next element and check if 
        IF: # checks if arr[i]>arr[i+1] and then swapping logic
            addi x18 x15 0 # temp = arr[i]
            addi x15 x17 0 # arr[i] = arr[i+1]
            addi x17 x18 0 # arr[i+1]= temp
            sw x15 0(x16)# stores in the right address
            sw x17 4(x16)# stores in the right address
            addi x16 x16 4 #increment x16 to move to next set of values
        j InternalFor # repeat this internal for loop until x4 and x5 same
    
    Main:
        addi x7 ,x0 ,0 #just some initializations the we need
        lw x16 base
        addi x21 x0 20 # stores 20
        Loop1: # for printing values of arr before sorting
        add x4 ,x0, x7 #added j=0 incrementor is x7
        addi x7 ,x7 ,1 #j++
        beq x4 ,x21 ,Sort #goes to sorting fn if everyting printed
        lw x15 ,0(x16) #printing logic...(put printing byte in x15)
        addi x16 x16 4 #increment base to for printing next byte
        j Loop1 # keep on printing
    Sort:
        jal x22 For # calls 2 for loops above which sort the arr
    AfterSortingIsComplete: #as the name suggests
        lw x16 base # doing some initializations I need
        addi x7,x0,0 
        addi x4 ,x0 ,0
        add x4 ,x0, x7 #added j=0 incrementor is x7
        addi x7 ,x7 ,1 #j++
        beq x4 ,x21 ,return #final printing logic...
        lw x15 ,0(x16)
        addi x16 x16 4
    return:`);
})

selection.addEventListener("click", () => {
    setValue2(`#Selection Sort


    #void selectionSort(int arr[], int n) 
    #{ 
     #   int i, j, min_idx; 
      
       # // One by one move boundary of 
      #  // unsorted subarray 
     #   for (i = 0; i < n - 1; i++) { 
      
        #    // Find the minimum element in 
       #     // unsorted array 
      #      min_idx = i; 
      #      for (j = i + 1; j < n; j++) { 
      #          if (arr[j] < arr[min_idx]) 
      #              min_idx = j; 
     #       } 
     # 
     #       // Swap the found minimum element 
     #       // with the first element 
     #       if (min_idx != i) 
     #           swap(arr[min_idx], arr[i]); 
     #   } 
    #} 
    #selection sort
    .data
    .word 1,7,3,2,5,4,3,5,1
    base: .word 0x54
    
    .text
    addi x1 x0 -4 #i=0
    addi x2 x0 0 # min index
    addi x9 x0 32 # n-1
    addi x10 x0 36
    lw x16 base
    
    OuterLoop:
        bgt x1 x9 Exit
        addi x1 x1 4
        addi x2 x1 0 #minIndex =i
        addi x3 x1 4 #j=i+1(4bytex)
        blt x3 x10 InnerLoop
        InnerLoop:
            beq x3 x10 Continue
         lw x16 base
         add x16 x16 x3 
         lw x4 0(x16) # arr[j]
         lw x16 base
         add x16 x16 x2
         lw x5 0(x16) # arr[min_index]
         blt x4 x5 if
          addi x3 x3 4
           j InnerLoop 
         if:
             addi x2 x3 0 # min_index = j
           addi x3 x3 4 #j++
           j InnerLoop 
       Continue:
           bne x2 x1 Swapper
           j OuterLoop
          Swapper:
              lw x16 base
              add x16 x16 x2
              lw x20 0(x16) #arr[min_index]
              lw x16 base
              add x16 x16 x1
              lw x21 0(x16) #arr[i]
              addi x22 x21 0 #temp = arr[i]
              addi x21 x20 0
              addi x20 x22 0
              lw x16 base
              add x16 x16 x2
              sw x20 0(x16)
              lw x16 base
              add x16 x16 x1
              sw x21 0(x16)
              j OuterLoop
     Exit:`);
})