package main.handlers;

import com.user.RightsScheme;
import com.user.BaseUsersHandler;
import com.user.BaseUserData;
import com.utils.Utils;
import com.database.QueryRow;
import com.database.queries.MultipleQuery;
import com.json.JObject;
import com.servlet.requests.HttpRequest;
import com.user.right.UserRight;
import com.utils.Ready;
import com.utils.Unquoted;
import com.utils.collections.Strings;

import java.sql.SQLException;
import model.Db;


/**
 * @author Miłosz Ziernik
 * @date 09 września 2015
 * @encoding UTF-8
 */
public class Users extends BaseUsersHandler {

    public Users() {

        features.removeUser = false;
        features.removeGroup = false;
        features.passwordChange = false;
    }

    @Override
    public void initialize() throws Exception {
        super.initialize();
        Ready.confirm(Users.class);
    }

    @Override
    protected void doInitialize() throws Exception {
        //FixMe: Dorobić obsługę typów użytkowników oraz grup
        Db db = new Db();
        MultipleQuery mqry = db.multipleQuery();

        Strings rights = new Strings();
        Strings groups = new Strings();

        // aktualizacja uprawnień
        for (UserRight right : UserRight.root.getAll()) {
            mqry.merge("users.rights", "id")
                    .arg("id", right.key)
                    .arg("name", right.name)
                    .arg("parent_right", right.parent != null ? right.parent.key : null);
            rights.add(right.key);
        }

        // aktualziacja grup
        for (RightsScheme group : RightsScheme.getAll()) {
            if (!group.embedded)
                continue;

            mqry.merge("users.groups", "id")
                    .arg("id", group.key)
                    .arg("name", group.name)
                    .arg("description", group.details)
                    .arg("embedded", true);

            groups.add(group.key);
        }

        if (!groups.isEmpty())
            mqry.query("DELETE FROM users.group_rights WHERE NOT right_key IN (?)", groups);

        for (RightsScheme group : RightsScheme.getAll()) {
            if (!group.embedded)
                continue;

            for (UserRight right : group.allowed)
                mqry.insert("users.group_rights")
                        .arg("group_key", group.key)
                        .arg("right_key", right.key)
                        .arg("refused", false);

            for (UserRight right : group.refused)
                mqry.insert("users.group_rights")
                        .arg("group_key", group.key)
                        .arg("right_key", right.key)
                        .arg("refused", true);

            groups.add(group.key);
        }

        if (!rights.isEmpty())
            mqry.query("DELETE FROM users.rights WHERE NOT id IN (?)", rights);

        if (!groups.isEmpty())
            mqry.query("DELETE FROM users.groups WHERE NOT id IN (?)", groups);

        mqry.execute();
    }

    private void processUserRow(BaseUserData _user,
            QueryRow row) throws SQLException {
/*
        UserData user = (UserData) _user;
        user.id = row.getInt("id");
        user.status = UserStatus.get(row.getStr("status").charAt(0));
        user.type = UserType.get(row.getStr("type").charAt(0));
        user.token = row.getStr("external_token", null);
        user.username = row.getStr("username");
        user.passHash = row.getStr("password", null);
        user.firstname = row.getStr("first_name", null);
        user.lastname = row.getStr("last_name", null);
        user.email = row.getStr("email", null);
        user.displayName = row.getStr("display_name", null);
        user.ldapAuth = row.getBool("ldap_auth", null);
        user.createdBy = row.getStr("created_by", null);
        user.inContactBook = row.getBool("contact_book", false);
        user.created = row.getDate("created").defaultFormat(TDate.FULL);
        user.passwordExpire = row.getDate("password_expire", null);
        //--------------------------------------------------------

        GRep.userFields.onReady(() -> {
            Map<String, String> map = row.getMapString("fields");

            if (map.isEmpty())
                return;

            for (Map.Entry<String, String> entry : map.entrySet()) {
                String key = entry.getKey();
                String value = entry.getValue();
                UserField uf = GRep.userFields.get(key, true);
                if (uf != null)
                    user.fields.add(uf.parse(JSON.parse(value)));
            }
        });

        GRep.accounts.onReady(() -> {
            for (Integer id : row.getArrayInt("accounts", false))
                user.accounts.add(GRep.accounts.getByIdF(id));
        });

        for (String s : row.getArray("groups", false))
            user.rights.addGroup(RightsScheme.get(s, true));

        for (String s : row.getArray("rights", false)) {
            String[] split = s.split(":");
            if (split.length != 2)
                continue;

            Boolean refused = Utils.strBool(split[1], null);
            UserRight right = UserRight.get(split[0]);

            if (refused == null || right == null)
                continue;

            if (refused)
                user.rights.denny(right);
            else
                user.rights.allow(right);
        }
//     user.roles.map(Role.asList(row.getArray("roles", false), user.username));*/
    }

    @Override
    protected boolean doGetUser(BaseUserData user, boolean includeAttributes) throws Exception {
        Db db = new Db();
        QueryRow row = db.execute(USERS_QUERY,
                new Unquoted("username = " + db.escape(user.username))).first();

        if (row == null)
            return false;

        processUserRow(user, row);
        return true;
    }

    @Override
    protected void doEditUser(BaseUserData _user, boolean isNew) throws Exception {
      /*  UserData user = (UserData) _user;
        Db db = new Db();
        db.transaction((Database db1) -> {

            Map<String, Object> fields = new LinkedHashMap<>();
            for (UserFieldImpl f : user.fields)
                fields.put(f.field.id, f.getStringValue());

            QueryRow row = db.insertOrUpdate("users.users",
                    user.id != null ? "id = ?" : null, user.id)
                    .addReturningColumn("id")
                    .addReturningColumn("created")
                    .arg("username", user.username)
                    .arg("display_name", user.displayName)
                    .arg("external_token", user.token)
                    .arg("status", user.status != null ? user.status.key : UserStatus.active.key)
                    .arg("type", user.type != null ? user.type.key : UserType.normal.key)
                    .arg("password", user.passHash)
                    .arg("first_name", user.firstname)
                    .arg("last_name", user.lastname)
                    .arg("created_by", user.createdBy)
                    .arg("email", user.email)
                    .arg("fields", fields)
                    .arg("ldap_auth", user.ldapAuth)
                    .arg("contact_book", user.inContactBook)
                    .arg("accounts::integer[]", user.accounts.stream()
                            .map((Account p) -> p.id)
                            .filter(Objects::nonNull)
                            .map(Collectors.toList())
                    )
                    .execute().first();

            user.id = row.getInt("id");
            user.created = row.getDate("created");
            MultipleQuery mqry = db1.multipleQuery();
            mqry.query("DELETE FROM users.user_rights WHERE user_id = ?", user.id);
            mqry.query("DELETE FROM users.user_groups WHERE user_id = ?", user.id);
            mqry.query("DELETE FROM users.user_attributes WHERE user_id = ?", user.id);
            {
                InsertMultiple ins = mqry.insertMultiple("users.user_groups",
                        "user_id", "group_key");

                for (RightsScheme group : user.rights.groups)
                    ins.add(user.id, group.key);
            }
            {
                InsertMultiple ins = mqry.insertMultiple("users.user_rights",
                        "user_id", "right_key", "refused");

                for (UserRight r : user.rights.allowed)
                    ins.add(user.id, r.key, false);

                for (UserRight r : user.rights.denied)
                    ins.add(user.id, r.key, true);
            }
            mqry.execute();
        });

        if (user.structures != null) {
            GRep.structure.setUserStructures(_user, user.structures);
            user.structures = null;
        }*/
    }

    @Override
    protected void doRemoveUser(BaseUserData user) throws Exception {
    /*    if (user == null)
            return;

        if (user.isRoot() || user.id == null)
            throw new UnsupportedOperationException();

        MultipleQuery mqry = new Db().multipleQuery();
        mqry.query("DELETE FROM users.user_rights WHERE user_id = ?", user.id);
        mqry.query("DELETE FROM users.user_groups WHERE user_id = ?", user.id);
        mqry.query("DELETE FROM users.users WHERE id = ?", user.id);
        mqry.execute();

        // Usunięcie powiązań -------------------------------
        GRep.structure.removeUserFromStructures(user);

        Relation relation = Relation.get(RelationType.USER, Objects.toString(user.id), false);
        Relations.removeFromDb(relation);

        new ServiceEvent(this.getClass().getSimpleName(), "Usunięcie użytkownika \"" + user.username + "\"")
                .key(ForeignKeysMap.USER.key, user.id)
                .execute();*/
    }

    @Override
    public void doEditGroup(RightsScheme group, boolean isNew) throws SQLException {

        Db db = new Db();
        MultipleQuery mqry = db.multipleQuery();

        // usuń wszystkie role danej grupy
        mqry.query("DELETE FROM users.group_rights WHERE group_key = ?", group.key);

        mqry.merge("users.groups", "id")
                .arg("id", group.key)
                .arg("name", group.name)
                .arg("description", group.details)
                .arg("embedded", group.embedded)
                .arg("enabled", group.enabled);

        for (UserRight r : group.allowed)
            mqry.insert("users.group_rights")
                    .arg("group_key", group.key)
                    .arg("right_key", r.key)
                    .arg("refused", false);

        for (UserRight r : group.refused)
            mqry.insert("users.group_rights")
                    .arg("group_key", group.key)
                    .arg("right_key", r.key)
                    .arg("refused", true);

        mqry.execute();

    }

    @Override
    protected void doRemoveGroup(RightsScheme group) throws Exception {
/*
        MultipleQuery mqry = new Db().multipleQuery();
        mqry.query("DELETE FROM users.group_rights WHERE group_key = ?", group.key);
        mqry.query("DELETE FROM users.user_groups WHERE group_key = ?", group.key);
        mqry.query("DELETE FROM users.groups WHERE id = ?", group.key);
        mqry.execute();

        // Usunięcie powiązań -------------------------------
        BaseUsersHandler userHandler = BaseUsersHandler.instance();
        for (BaseUserData usr : userHandler.getUsers())
            if (usr.rights.groups.remove(group))
                userHandler.editUser(usr, false);

        Relation relation = Relation.get(group);
        Relations.removeFromDb(relation);*/
    }

    @Override
    protected JObject doLoadUserConfig(BaseUserData user) throws Exception {
        return null;
    }

    @Override
    protected void doSaveUserConfig(BaseUserData user, JObject data) throws Exception {
    }

    @Override
    public void doExportUsers(HttpRequest request) throws Exception {

    }

    @Override
    public void reload() throws Exception {
        Db db = new Db();

        RightsScheme.clearAll();
        allUsers.clear();

        for (QueryRow row : new Db().execute(USERS_QUERY, true)) {
            BaseUserData user = BaseUserData.newInstance(this);
            processUserRow(user, row);
            allUsers.add(user);
        }

        for (QueryRow row : db.execute("SELECT g.*,\n"
                + "    (\n"
                + "        SELECT array_agg(right_key || ':' || refused)\n"
                + "        FROM users.group_rights gr\n"
                + "        WHERE gr.group_key = g.id\n"
                + "    ) as rights\n"
                + "FROM users.groups g")) {
            RightsScheme group = null;

            if (row.getBool("embedded")) {
                group = RightsScheme.get(row.getStr("id"), true);
                if (group != null && !group.embedded)
                    throw new UnsupportedOperationException(group.key + " embedded");
            }

            if (group == null)
                group = new RightsScheme(row.getStr("id"), row.getStr("name"),
                        (Class<? extends UserRight>[]) null);

            group.details = row.getStr("description", null);
            group.enabled = row.getBool("enabled");

            for (String ss : row.getArray("rights", false)) {
                String[] arr = ss.split(":");
                if (arr.length != 2)
                    continue;
                Boolean refused = Utils.strBool(arr[1], false);
                UserRight right = UserRight.get(arr[0]);
                if (right == null)
                    continue;
                if (refused)
                    group.refused.add(right);
                else
                    group.allowed.add(right);
            }
        }
    }

    private final static String USERS_QUERY = "SELECT * , \n"
            + "        (SELECT array_agg(right_key || ':' || refused)\n"
            + "        FROM users.user_rights ur\n"
            + "        WHERE ur.user_id = u.id) as rights,\n"
            + "        (SELECT array_agg(group_key)\n"
            + "        FROM users.user_groups gr\n"
            + "        WHERE gr.user_id = u.id) as groups      \n"
            + "FROM users.users u\n"
            + "WHERE ?\n"
            + "ORDER BY id";
}
