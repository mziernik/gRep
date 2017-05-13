package main.handlers;

import com.context.AppContext;
import com.servlet.controller.Controller;
import com.user.BaseAuthHandler;
import com.user.BaseUserData;
import main.GRep;

public class Auth extends BaseAuthHandler {

    // public final static CStringList unathorized = new CStringList("service.unauthorized_hosts");
    @Override
    public boolean checkPageAuthorization(Controller page, boolean force) throws Exception {
        if (true)
            return true;

      //  String host = page.http().request.getRemoteHost();

//        for (String s : unathorized.values())
//            if (host.equals(s))
//                return true;
//        if (AppContext.devMode)
//            return true;
//        
        return super.checkPageAuthorization(page, force);
    }

    @Override
    public boolean authorize(Controller page, BaseUserData user, boolean authRequest) throws Exception {
        if (true)
            return true;

   //     String host = page.http().request.getRemoteHost();

//        for (String s : unathorized.values())
//            if (host.equals(s))
//                return true;
        return super.authorize(page, user, authRequest);
    }
}
