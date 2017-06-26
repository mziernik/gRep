import {Utils, Record, Field, Repository, CRUDE} from "../../core";

export default class RepositoryStorage {

    /** Wczytaj zawartość repozytoriów */
    load(repos: Repository[]): Promise {
        throw new Error("Unsupported operation");
    }

    /** zapis danych - submit */
    save(context: any, records: Record[]): Promise {
        throw new Error("Unsupported operation");
    }

    /** Wczytaj dane rekordów (na potrzeby danych typu onDemand) */
    read(records: Record[]): Promise {
        throw new Error("Unsupported operation");
    }


    /** Wczytaj wszystkie repozytoria */
    static loadData() {
        const map: Map = Utils.agregate(Repository.all, (repo: Repository) => repo.storage);
        map.forEach((repos: Repository[], storage: RepositoryStorage) => storage.load(repos)
            .then(data => Repository.update(storage, data)));
    }

}