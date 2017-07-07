import {React} from '../../core';
import {Page, Link, FontAwesome, Table, Panel} from '../../components';

export default class PLocalStorage extends Page {

    draw() {
        return <Panel fit>
            {super.renderTitle("Magazyn lokalny")}

            <Table
                columns={["ID", "Nazwa", "Akcja"]}

                rows={Object.keys(window.localStorage)}
                rowMapper={(key: string) => [
                    key,
                    window.localStorage.getItem(key),
                    <Link
                        icon={FontAwesome.TIMES}
                        title="Usuń"
                        confirm="Czy na pewno usunąć?"
                        onClick={() => {
                            window.localStorage.removeItem(key);
                            this.forceUpdate();
                        }}
                    />
                ]}>
            </Table>
        </Panel>
    }


}

