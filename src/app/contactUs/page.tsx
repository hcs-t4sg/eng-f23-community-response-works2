"use client"
import '../assets/styles.css';
import * as Tabs from '@radix-ui/react-tabs';
import FormContent from './formContent';


export default function ContactForm() {

  return (
    <div> 
      <div className='form-container'>
        <Tabs.Root className="TabsRoot" defaultValue="tab1">
          <Tabs.List className="TabsList">
            <Tabs.Trigger className="TabsTrigger" value="tab1">
              Feedback
            </Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="tab2">
              Report Issues
            </Tabs.Trigger>
            <Tabs.Trigger className="TabsTrigger" value="tab3">
              Help!
            </Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab1">
            <FormContent formType={'Feedback'} user={'A'}/>
          </Tabs.Content>
          <Tabs.Content value="tab2">
            <FormContent formType={'Issues'} user={'A'}/>
          </Tabs.Content>
          <Tabs.Content value="tab3">
            <FormContent formType={'Help'} user={'A'}/>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
