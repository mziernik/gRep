import {Field, DataType, Repository, Record} from "../core/core";


export class CategoryAttributeRepo extends Repository {


    constructor() {
        super("categoryAttr", "Atrybut kategorii", DataType.INT, CategoryAttribute);
    }

}

export class CategoryAttribute extends Record {

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    DISPLAYMASK: Field = new Field(DataType.BOOLEAN).name("displayMask").title("Maska wyświetlania");

    UNIQUE: Field = new Field(DataType.BOOLEAN).name("unique").title("Unikalny");

    MULTIPLE: Field = new Field(DataType.BOOLEAN).name("multiple").title("Wielokrotne");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    ATTRIBUTE: Field = new Field(DataType.INT).name("attribute").title("Atrybut");

    ABSTRACT: Field = new Field(DataType.BOOLEAN).name("abstract").title("Abstrakcyjny");

    CATEGORY: Field = new Field(DataType.INT).name("category").title("Kategoria");

    REQUIRED: Field = new Field(DataType.BOOLEAN).name("required").title("Wymagane");

    DEFVAL: Field = new Field(DataType.ARRAY).name("defVal").title("Wartość domyślna");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class AttributeElementRepo extends Repository {


    constructor() {
        super("attrElm", "Element atrybutu", DataType.INT, AttributeElement);
    }

}

export class AttributeElement extends Record {

    MAX: Field = new Field(DataType.INT).name("max").title("Maksimum");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    FOREIGNELM: Field = new Field(DataType.INT).name("foreignElm").title("Element zewnętrzny");

    DESCRIPTION: Field = new Field(DataType.STRING).name("description").title("Opis");

    TYPE: Field = new Field(DataType.STRING).name("type").title("Typ");

    REQUIRED: Field = new Field(DataType.BOOLEAN).name("required").title("Wymagany");

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    REGEX: Field = new Field(DataType.STRING).name("regex").title("Wyrażenie sprawdzające");

    MIN: Field = new Field(DataType.INT).name("min").title("Minimum");

    ENCRYPTED: Field = new Field(DataType.BOOLEAN).name("encrypted").title("Zaszyfrowany");

    NAME: Field = new Field(DataType.STRING).name("name").title("Nazwa");

    ENUMERATE: Field = new Field(DataType.OBJECT).name("enumerate").title("Enumerata");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    KEY: Field = new Field(DataType.STRING).name("key").title("Klucz");

    DEFVAL: Field = new Field(DataType.ARRAY).name("defVal").title("Wartość domyślna");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class CatalogAttributeRepo extends Repository {


    constructor() {
        super("catalogAttr", "Atrybut katalogu", DataType.INT, CatalogAttribute);
    }

}

export class CatalogAttribute extends Record {

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    NOTES: Field = new Field(DataType.STRING).name("notes").title("Notatki");

    CRYPTKEY: Field = new Field(DataType.ARRAY).name("cryptKey").title("Klucz");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    CATALOG: Field = new Field(DataType.INT).name("catalog").title("Katalog");

    INDEX: Field = new Field(DataType.INT).name("index").title("Kolejność");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    ATTRIBUTE: Field = new Field(DataType.INT).name("attribute").title("Atrybut");

    VALUE: Field = new Field(DataType.ARRAY).name("value").title("Wartość");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class ResourceRepo extends Repository {


    constructor() {
        super("resource", "Zasób", DataType.INT, Resource);
    }

}

export class Resource extends Record {

    CRYPTKEY: Field = new Field(DataType.INT).name("cryptKey").title("Klucz");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    CATALOG: Field = new Field(DataType.INT).name("catalog").title("Katalog");

    FORMAT: Field = new Field(DataType.STRING).name("format").title("Format");

    DESCRIPTION: Field = new Field(DataType.STRING).name("description").title("Opis");

    TYPE: Field = new Field(DataType.STRING).name("type").title("Typ");

    TAGS: Field = new Field(DataType.ARRAY).name("tags").title("Tagi");

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    FILE: Field = new Field(DataType.STRING).name("file").title("Plik");

    SIZE: Field = new Field(DataType.INT).name("size").title("Rozmiar");

    NAME: Field = new Field(DataType.STRING).name("name").title("Nazwa");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    VALUE: Field = new Field(DataType.STRING).name("value").title("Wartość");

    MD5: Field = new Field(DataType.STRING).name("md5").title("MD5");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class AttributeRepo extends Repository {


    constructor() {
        super("attribute", "Atrybut", DataType.INT, Attribute);
    }

}

export class Attribute extends Record {

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    PARENT: Field = new Field(DataType.INT).name("parent").title("Rodzic");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    ELEMENTS: Field = new Field(DataType.ARRAY).name("elements").title("Elementy");

    ICON: Field = new Field(DataType.STRING).name("icon").title("Ikona");

    NAME: Field = new Field(DataType.STRING).name("name").title("Nazwa");

    DESCRIPTION: Field = new Field(DataType.STRING).name("description").title("Opis");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    KEY: Field = new Field(DataType.STRING).name("key").title("Klucz");

    REQUIRED: Field = new Field(DataType.BOOLEAN).name("required").title("Wymagane");

    DEFVAL: Field = new Field(DataType.ARRAY).name("defVal").title("Wartość domyślna");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class CategoryRepo extends Repository {


    constructor() {
        super("category", "Kategoria", DataType.INT, Category);
    }

}

export class Category extends Record {

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    NAME: Field = new Field(DataType.STRING).name("name").title("Nazwa");

    ICON: Field = new Field(DataType.INT).name("icon").title("Ikona");

    DESCRIPTION: Field = new Field(DataType.STRING).name("description").title("Opis");

    ATTRIBUTES: Field = new Field(DataType.ARRAY).name("attributes").title("Dozwolone atrybuty");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    CATEGORIES: Field = new Field(DataType.ARRAY).name("categories").title("Kategoria");

    KEY: Field = new Field(DataType.STRING).name("key").title("Klucz");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class CatalogRepo extends Repository {


    constructor() {
        super("catalog", "Katalog", DataType.INT, Catalog);
    }

}

export class Catalog extends Record {

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    PARENT: Field = new Field(DataType.INT).name("parent").title("Rodzic");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    NAME: Field = new Field(DataType.STRING).name("name").title("Nazwa");

    INDEX: Field = new Field(DataType.INT).name("index").title("Kolejność");

    DESCRIPTION: Field = new Field(DataType.STRING).name("description").title("Opis");

    ATTRIBUTES: Field = new Field(DataType.ARRAY).name("attributes").title("Dozwolone atrybuty");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    ABSTRACT: Field = new Field(DataType.BOOLEAN).name("abstract").title("Abstrakcyjne");

    CATEGORY: Field = new Field(DataType.INT).name("category").title("Definicja");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export class CryptKeyRepo extends Repository {


    constructor() {
        super("cryptKey", "Klucz szyfrujący", DataType.INT, CryptKey);
    }

}

export class CryptKey extends Record {

    UID: Field = new Field(DataType.STRING).name("uid").title("UID");

    CREATED: Field = new Field(DataType.DATE).name("created").title("Utworzono");

    ID: Field = new Field(DataType.INT).name("id").title("ID").primaryKey();

    SERVICEKEY: Field = new Field(DataType.STRING).name("serviceKey").title("Klucz usługi");

    USERID: Field = new Field(DataType.INT).name("userId").title("Użytkownik");

    USERKEY: Field = new Field(DataType.STRING).name("userKey").title("Klucz użytkownika");

    MD5: Field = new Field(DataType.STRING).name("md5").title("MD5");


    constructor() {
        super(...arguments);
        this.init();
    };


}

export const CATEGORY_ATTRIBUTE: CategoryAttributeRepo = Repository.register(new CategoryAttributeRepo());
export const ATTRIBUTE_ELEMENT: AttributeElementRepo = Repository.register(new AttributeElementRepo());
export const CATALOG_ATTRIBUTE: CatalogAttributeRepo = Repository.register(new CatalogAttributeRepo());
export const RESOURCE: ResourceRepo = Repository.register(new ResourceRepo());
export const ATTRIBUTE: AttributeRepo = Repository.register(new AttributeRepo());
export const CATEGORY: CategoryRepo = Repository.register(new CategoryRepo());
export const CATALOG: CatalogRepo = Repository.register(new CatalogRepo());
export const CRYPT_KEY: CryptKeyRepo = Repository.register(new CryptKeyRepo());