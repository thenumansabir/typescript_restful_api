export class ValidationError extends Error{
    constructor(message:string){
        super(message);
        this.name = "Validation Error";
    }
}

export class DatabaseError extends Error{
    constructor(message:string){
        super(message);
        this.name = "Databae Error";
    }
}

  
