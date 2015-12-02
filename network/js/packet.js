function Packet( src, dest, birthTime, interArrivalTime){

    this.birthTime = birthTime;
    this.src = src;
    this.dest = dest;
    this.numCollisions = 0;
    this.txTime = 0;
    this.rxTime = 0;
    this.nextAttemptTime = birthTime;
    this.interArrivalTime = interArrivalTime;
    this.destMAC = -1;
} 
