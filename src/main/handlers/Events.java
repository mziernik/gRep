package main.handlers;

import com.context.EventsHandler;
import com.context.ServiceStatus;
import com.database.QueryRows;
import com.database.queries.Insert;
import com.database.queries.MultipleQuery;
import com.events.ServiceEvent;
import com.utils.date.TDate;
import com.webapi.core.WebApiController;
import com.webapi.core.WebApiRequest;
import java.sql.SQLException;
import java.util.LinkedList;
import java.util.Map.Entry;
import model.Db;

/**
 * @author Miłosz Ziernik
 * @date 03 listopada 2015
 * @encoding UTF-8
 */
public class Events extends EventsHandler {

    @Override
    public void onServiceEvent(ServiceEvent event) throws Exception {
        if (true)
            return;
        /* try {
            int eventId;
            Db db = new Db();
            {
                WebApiRequest request = (WebApiRequest) CurrentThread.get(WebApiController.THREAD_REQUEST_ID);

                Insert ins = db.insert("events.events");
                ins.addReturningColumn("id");
                ins.arg("type", event.type().key);
                ins.arg("tags::text[]", event.tags());
                ins.arg("source", event.source());
                ins.arg("event", event.value());
                ins.arg("username", event.username());
                ins.arg("user_id", event.userId());

                if (request != null && request.controller != null && request.controller.connection != null) {
                    ins.arg("address", request.controller.connection.remoteAddress);
                    ins.arg("url", request.controller.connection.requestUrl);
                }

                QueryRows execute = ins.execute();
                eventId = execute
                        .firstD()
                        .getInt("id");
            }

            MultipleQuery mqry = db.multipleQuery();

            for (ServiceEvent.ServiceEventAttribute attr : event.attributes) {
                Insert ins = mqry.insert(attr.details
                        ? "events.details"
                        : "events.attributes");
                ins.arg("event_id", eventId);
                ins.arg("tags::text[]", attr.tags);
                ins.arg("name", attr.displayName);
                ins.arg("value", attr.value);
            }

            for (Entry<String, LinkedList<Integer>> fks : event.getKeys().entrySet()) {
                Insert ins = mqry.insert("events.foreign_keys");
                ins.arg("event_id", eventId);
                ins.arg("column_name", fks.getKey());
                ins.arg("keys::int[]", fks.getValue());
            }

            mqry.execute();

        } catch (SQLException ex) {
            throw new RuntimeException(ex);
        }*/
    }

}
