// select name, age from users where name = $p1 && id = 6; 
// select * from users join documents on user.id = documents.userId; 
// insert into users (name, lastname, age, gender) values ($p1, $p2, 24, $p3); 
// update users set role = $p1, age = 33 where id = 5; command      target attr condition 
// delete from users where id = 5;                     command      target condition
// alter address remove city;                          command attr action target
// alter address add city;                             command attr action target

export class JsonTransaction {
    private dataBase: any;
    private transaction: any;
    cachedQueries: any = {};

    constructor(node: any) {
        this.dataBase = node;
        this.transaction = JSON.parse(JSON.stringify(node));
    }

    sql(query: string) {
        const command = this.preparedQueryStatementFor(query);

        return this.executeQuery(command);
    }
    private executeQuery(command: any) {

    }
    private preparedQueryStatementFor(query: any) {
        let result = this.cachedQueries[query];
        
        if (!result) {
            result = {};

            this.cachedQueries[query] = result;
        }
        return result;
    }

    commit () {
        this.dataBase = this.transaction;
    }
    
}
export class JsonAsDataSource  {

    dataBase: any;

    constructor(node: any) {
        this.dataBase = node;
    }

    getTransaction() {
        return new JsonTransaction(this.dataBase);
    }

}
