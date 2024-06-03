export class UserService {
    #useSession = undefined;
    #currentUser = undefined;

    constructor() {
        this.#useSession = localStorage.getItem("token");
        this.#currentUser = localStorage.getItem("user");
    }

    logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        this.#useSession = undefined;
        this.#currentUser = undefined;
    }
}