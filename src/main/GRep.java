package main;

import api.WApi;
import com.config.CHttp;
import com.utils.Path;
import com.context.AppContext;
import com.dev.Dev;
import com.context.Environment;
import com.context.WebAppContext;
import com.database.DbHandler;
import com.dev.DevAction;
import com.mlogger.handlers.ConsoleHandler;
import com.mlogger.handlers.MLogFileHandler;
import com.servlet.Handlers;
import com.utils.Is;
import com.utils.Utils;
import com.webapi.core.WebApiControllerMeta;
import java.io.File;
import java.util.logging.Handler;
import main.handlers.Auth;
import main.handlers.Config;
import main.handlers.DbHnd;
import main.handlers.Events;
import main.handlers.Ldap;
import main.handlers.Users;
import model.Db;

@javax.servlet.annotation.WebListener
public class GRep extends AppContext implements WebAppContext {

    @Override
    @SuppressWarnings("unchecked")
    protected void config() throws Exception {

        Handlers.config.setHandler(new Config());
        //Handlers.userData.setHandler(UserData.class);
        Handlers.users.setHandler(new Users());
        Handlers.ldap.setHandler(Ldap.class);
        Handlers.auth.setHandler(Auth.class);
        Handlers.events.setHandler(new Events());
        Handlers.database.setHandler(new DbHnd());

     //   WebApiControllerMeta.autoGenerateJsClient("view/grepApi.js", WApi::new);

        //logger.addEventsHandler(new Logs());
        if (devMode) {
            File f = new File(sourcesPath.getFile(), "../../Framework/src").getCanonicalFile();
            if (f.exists())
                Dev.sources.add(new Path(f.getCanonicalFile()));
        }
        if (Environment.fxSupported && (com.dev.console.DevConsole.enabled || !Is.empty(Dev.remote)))
            for (Handler h : logger.getHandlers())
                if (h instanceof ConsoleHandler) {
                    logger.removeHandler(h);
                    break;
                }
        if (!AppContext.unitTestMode)
            logger.addHandler(new MLogFileHandler());

        Db.CDatabase.host.setUserValueAsCurrent("localhost");

    }

    public GRep(String[] args) {
        super(args);
    }

    public GRep() {
        super(null);
    }

    public static void main(String[] args) {

        new GRep(args);
    }

}

class ActWww extends DevAction {

    public ActWww() {
        super("WWW");
        order = -10;
    }

    @Override
    public void run() throws Exception {
        Utils.runBrowser(CHttp.url.value().toString());
    }

}
