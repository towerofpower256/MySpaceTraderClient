import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import MyPageTitle from '../Components/MyPageTitle';

import ToolsContextViewer from "../Components/Tools/ToolsContextViewer";
import ToolWebCalls from '../Components/Tools/ToolWebCalls';
import setPageTitle from '../Utils/setPageTitle';

export default function DevToolsPage(props) {
    setPageTitle("Dev Tools");
    
    return (
        <div>
            <MyPageTitle>Dev Tools</MyPageTitle>

            <Tabs
                defaultActiveKey="context"
                id="devtools-tab"
                className="mb-3 mt-3">
                <Tab eventKey="context" title="Contexts">
                    <ToolsContextViewer />
                </Tab>
                <Tab eventKey="web-calls" title="Web Calls">
                    <ToolWebCalls />
                </Tab>
            </Tabs>
        </div>
    )
}