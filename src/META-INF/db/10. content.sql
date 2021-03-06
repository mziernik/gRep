

INSERT INTO repo_state ("key", name, broadcast, on_demand, crude, revision) VALUES
    ('threads', 'Wątki', false, false, '{R}', 0),
    ('status', 'Status', false, false, '{R}', 0);

INSERT INTO data.element (type, key, name, MIN, MAX, description, enumerate) VALUES
    ('string', 'text',   'Wartość', 1, 100, NULL, NULL), --1
    ('int', 'size',   'Rozmiar', 0, 100000000, 'Rozmiar danych w bajtach', NULL), --2
    ('string', 'protocol', 'Protokół', 1, 100, 'Protkół', --3
        '"HTTP"=>"HTTP", "HTTPS"=>"HTTPS", "TCP"=>"TCP", "UDP"=>"UDP", "SSH"=>"SSH", 
        "FTP"=>"FTP", "SCP"=>"SCP", "FILE"=>"FILE"'),
    ('string', 'url',    'URL', 1, 100, 'Adres URL (protokół://użytkownik:hasło@domena)', NULL), --4
    ('string', 'domain', 'Domena', 1, 100, 'Nazwa domeny', NULL), --5
    ('string', 'fdn',    'FDN', 1, 100, 'IP, nazwa sieciowa lub domena', NULL), --6
    ('int', 'port',   'Port', 0, 65535, 'Numer portu TCP/UDP', NULL), --7
    ('string', 'ip',     'IP', 1, 100, 'Adres IP', NULL), --8
    ('string', 'mac',    'MAC', 1, 100, 'Adres MAC', NULL), --9
    ('int', 'netMask','Maska', 0, 32, 'Maska sieci', NULL), --10
    ('string', 'intfType', 'Typ interfejsu', 1, 100, 'Typ interfejsu sieciowego',  --11
        '"lan"=>"LAN", "wlan"=>"WiFi", "lo"=>"Loopback", "vpn"=>"VPN"'),
    ('string', 'addrType','Typ adresu', 0, 32, 'Typ adresu',  --12
        '"none"=>"Brak", "static"=>"Statyczny", "dhcp"=>"DHCP"'),
    ('string', 'login',  'Login', 1, 100, 'Login', NULL), --13
    ('password', 'pass',   'Hasło', 1, 100, 'Hasło', NULL), --14
    ('string', 'key',    'Klucz', 1, 100, 'Klucz, numer seryjny', NULL), --15
    ('string', 'name',   'Nazwa', 1, 100, NULL, NULL) --16
;

INSERT INTO data.attribute (key, name, display_mask, icon) VALUES
    ('name',    'Nazwa',        null, null),   --1
    ('model',   'Model',        null, null),   --2
    ('vendor',  'Producent',    null, null),   --3
    ('ip',      'Adres IP',     '%1 (%2)', null),    --4
    ('account', 'Konto',        '%1:*****', null), --5
    ('url',     'URL',          null, 'linkedin-square'),          --6
    ('intf',    'Interfejs sieciowy', '%1, %2, %3, %4, %5', null), --7
    ('sshAccount','Konto SSH',  '%3:%4@%1:%2', 'user'), --8
    ('wiFi',      'WiFi',       '%1:*****', 'film')            --9
;

INSERT INTO data.attribute_element (attr, elm, def_val, required) VALUES
    (1, 1, null, true), -- 1 nazwa-text
    (2, 1, null, true), -- 2 model-text
    (3, 1, null, true), -- 3 vendor-text
    (4, 8, null, true), -- 4 ip-ip
    (4, 5, null, false), -- 5 ip-domena
    (5, 13, null, true), -- 6 konto-login
    (5, 14, null, false), -- 7 konto-hasło
    (6, 4, null, true), -- 8 url-url
    (7, 11, '"lan"', true), -- 9 intf-type
    (7, 12, '"static"', false), -- 10 addr-type 
    (7, 9, null, false),    -- 11 intf-mac
    (7, 8, null, true),     -- 12 intf-ip
    (7, 5, null, false),    -- 13 intf-domena
    (8, 6, null, true),     -- 14 ssh-ip
    (8, 7, '22', true),     -- 15 ssh-port
    (8, 13, null, true),    -- 16 ssh-login
    (8, 14, null, true),    -- 17 ssh-pass
    (9, 16, null, true),     -- 18 wifi-nazwa
    (9, 14, null, true)     -- 19 wifi-pass
;
INSERT INTO data.category (key, name, description, categories) VALUES
    ('dir',         'Folder',       'Folder',       '{}'),
    ('bookmark',    'Zakładka',     'Zakładka',     '{}'),
    ('account',     'Konto',        'Konto',        '{}'),
    ('device',      'Urządzenie',   'Urządzenie',   '{}'),
    ('project',     'Projekt',      'Projekt',      '{1}')
;

INSERT INTO data.catalog (category, parent, name) VALUES
    (1, null, 'Dokumenty'),     --1
    (1, null, 'Konfiguracja'),  --2
    (1, null, 'Skrypty'),       --3
    (2, null, 'Zakładki'),      --4
    (3, null, 'Konta'),         --5
    (4, null, 'Urządzenia'),    --6
    (5, null, 'Projekty'),      --7

    (1, 1, 'Budowa'),           --8
    (1, 1, 'Przepisy'),         --9

    (1, 2, 'Linux'),            --10
    (1, 2, 'NetBeans'),         --11
    (1, 2, 'AVR'),              --12

    (4, 6, 'Router Dasan'),     --13
    (4, 6, 'Router Asus'),      --14
    (4, 6, 'Media'),            --15
    (4, 6, 'DevKit'),           --16
    (4, 6, 'TV Salon'),         --17
    (4, 6, 'TV Sypialnia'),     --18
    (4, 6, 'Drukarka'),         --19
    (4, 6, 'Laptop Lenovo'),    --20
    (4, 6, 'Laptop HP'),        --21
    (4, 6, 'Tablet Lenovo'),    --22

    (5, 7, 'gRep'),             --23
    (5, 7, 'DevKit'),           --24
    (5, 7, 'Światło')           --25
;

INSERT INTO data.category_attribute (category, attribute, required, multiple, "unique") VALUES
    (4, 3, false, false, false),    -- 'Producent',
    (4, 2, false, false, false),    --'Model',     
    (4, 4, false, false, false),    -- 'IP',        
    (4, 5, false, false, false),    -- 'Konto',     
    (4, 6, false, false, false),    --'Adres',     
    (4, 8, false, false, false)     -- 'Konto',     
;

INSERT INTO data.catalog_attribute(catalog, attribute) VALUES 
    (14, 3),    --1 vendor
    (14, 2),    --2 model
    (14, 7),    --3 intf
    (14, 7),    --4 intf
    (14, 5),    --5 account
    (14, 6),    --6 url
    (14, 7),    --7 intf
    (14, 9)     --8 wiFi
; 

-- catalog_attribute, attribute_element

INSERT INTO data.catalog_attribute_value(cat_attr, attr_elm, value) VALUES 
    (1, 3, 'Asus'),             --vendor-text
    (2, 2, 'RT-AC1200G+'),      -- model
    (3, 9, 'lan'),             -- ip intf-type 
    (3, 10, 'dhcp'),             -- ip addr-type 
    (3, 12, '192.168.1.1'),      -- ip intf-ip
    (4, 9, 'wlan'),             -- ip intf-type 
    (4, 10, 'static'),             -- ip addr-type 
    (4, 12, '192.168.0.254'),    -- ip intf-ip
    (5, 6, 'admin'),           -- account
    (5, 7, 'hasło'),           -- account
    (6, 8, 'router.asus.com'),  -- url
    (8, 18, 'ZM-WiFi')          -- wiFi
; 


INSERT INTO data.resource(type, format, catalog, name, value) VALUES 
    ('D', 'Markdown',   1,   'Dokument markdown', '#przykładowa treść'),
    ('F', 'PDF',        14,  'Dokumentacja routera', '#treść dokumentacji')
;

/*

---------------------------------------------------------------------------------------------

INSERT INTO device (type, name, parent, abstract, status)
VALUES 
    ('S', 'Serwer kompilacji 10.0.3.6',		null, false,  'D'),
    ('V', 'Lincall v1 test 10.0.3.7',      	null, false,  'T'),
    ('V', 'Lincall v2 test 10.25.4.150',    null, false,  'R'),
    ('V', 'DRU',                            null, false,  'D'),
    ('S', 'KolRachunki',                    null, true,   'R'),
    ('V', 'kolrach-test',                   5,    false,  'T'),
    ('V', 'kolrach-prod',                   5,    false,  'R')
;

INSERT INTO interface (device, ip, net_mask) VALUES
    (1, '0.0.0.0',      NULL),
    (1, '10.0.3.6',     NULL),
    (2, '10.0.3.7',     NULL),
    (3, '10.25.4.150',  NULL),
    (4, '0.0.0.0',      NULL),
    (4, '10.25.4.140',  NULL),
    (4, '10.25.4.162',  NULL),
    (4, '10.25.4.163',  NULL),
    (4, '10.25.4.164',  NULL),
    (4, '10.25.4.166',  NULL), --10
    (6, '10.1.0.66',    NULL),
    (6, '10.1.0.67',    NULL),
    (7, '10.1.0.243',   NULL)
;


INSERT INTO dns (domain, interface)
VALUES
	('logi.eclicto.pl',               10),
	('rachunki-test.infover.pl',      11),
	('rachunki-demo.infover.pl',      12),
	('kolrachunki.kolporter.com.pl',  13)
;



INSERT INTO service(name, parent, default_port, parameters, abstract, protocol)
VALUES
    ('System operacyjny', null, null, '"x64"=>"Architektura 64-bitowa", "version"=>"Wersja"', true, false),
            ('Linux', 1, null, '', false, false),
            ('Windows', 1, null, '', false, false),
    ('Systemowe konto użytkownika', null, null, '', false, true),
    ('Serwer TCP', null, null, '', false, true),
    ('Serwer UDP', null, null, '', false, true),
    ('SSH', null, 22, '', false, true),
    ('FTP', null,  21, '', false, true),
    ('SMB, Samba', null, null, '', false, true),
    ('VNC', null, null, '', false, true),
    ('VPN', null, null, '', false, true),
    ('WiFi', null, null, '', false, true),
    ('Tomcat', null, null, '"version"=>"Wersja"', true, false),
            ('Manager', 13, null, '', false, false),
            ('HTTP', 13, 80, '', false, false),
            ( 'HTTPS', 13, 443, '', false, false),
    ('SysLog',null, null, '', false, false),
    ('WebService', null, 80, '', true, false),
            ('SOAP', 18, null, '"wsdl"=>"WSDL"', false, false),
            ( 'REST', 18, null, '"wadl"=>"WADL"', false, false),
    ('Konto użytkownika w usłudze', null, null, '', false, true),
    ('Baza danych', null, null, '', true, false),
            ('PostgreSQL', 22, 5432, '', false, false)
;

INSERT INTO project (name, parent, abstract)
VALUES 
	('eClicto',     null,   true),
	('Sklep',       1,      false),
	('Storage',     1,      false),
	('Content',     1,      false),
	('Lincall v1',  null,   false),
	('Lincall v2',  null,   true),
	('Lincore',     6,      false),
	('Manager',     6,      false),
	('Logi',        null,   false)
;



INSERT INTO instance(server, project, service)
VALUES
	('DRU', null, 'DB-PG'),
	('DRU', null, 'SSH' ),
    ('DRU', null, 'SMB' ),
	(null, 'logi', 'T-HTTP'),
	(null, 'logi', 'T-HTTPS'),
    (null, 'logi', 'UDP'),
    (null, 'logi', 'TCP')
;



INSERT INTO bindings(instance, interface, port, tcp)
VALUES
    (get_instance('DRU', null, 'SSH'), get_interface('10.25.4.140'), 5432, true),
    (get_instance('DRU', null, 'DB-PG'), get_interface('10.25.4.140'), 22, true),
    (get_instance('DRU', null, 'SMB'), get_interface('0.0.0.0', 'DRU'), 445, true),

    (get_instance(null, 'logi', 'T-HTTP'), get_interface('10.25.4.166'), 80, true),
    (get_instance(null, 'logi', 'T-HTTP'), get_interface('10.25.4.166'), 8080, true),

    (get_instance(null, 'logi', 'T-HTTPS'), get_interface('10.25.4.166'), 443, true),
    (get_instance(null, 'logi', 'T-HTTPS'), get_interface('10.25.4.166'), 8443, true),

    (get_instance(null, 'logi', 'UDP'), get_interface('10.25.4.166'), 514, false),
    (get_instance(null, 'logi', 'TCP'), get_interface('10.25.4.166'), 514, true),
    (get_instance(null, 'logi', 'UDP'), get_interface('10.25.4.166'), 5140, false)
;


*/


