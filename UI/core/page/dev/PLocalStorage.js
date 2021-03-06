import {React} from '../../core';
import {Page, Link, Icon, Table, Panel} from '../../components';

export default class PLocalStorage extends Page {

    render() {
        this.title.set("Magazyn lokalny");
        return <Table
            columns={["ID", "Nazwa", "Akcja"]}

            rows={Object.keys(window.localStorage)}
            rowMapper={(key: string) => [
                key,
                window.localStorage.getItem(key),
                <Link
                    icon={Icon.TIMES}
                    title="Usuń"
                    confirm="Czy na pewno usunąć?"
                    onClick={() => {
                        window.localStorage.removeItem(key);
                        this.forceUpdate();
                    }}
                />
            ]}>
        </Table>
    }
}

