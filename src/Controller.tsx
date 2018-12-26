import React, { useContext, useState, useCallback, useEffect } from 'react';
import { RootContext } from './Provider';
import { Form, Input, InputGroup, InputGroupAddon, Button } from 'reactstrap';
import { ProjectSelector } from './ProjectSelector';
import { MilestoneSelector } from './MilestoneSelector';
import { CustomValuesSelector } from './CustomValuesSelector';
import { DaysSelector } from './DaysSelector';
export const Controller = () => {
  const { state, setUrl } = useContext(RootContext);
  const [url, setStateUrl] = useState('');
  const handleUrl = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStateUrl(e.target.value);
    },
    [setStateUrl]
  );
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      if (url) {
        setUrl(url);
      }
      e.preventDefault();
    },
    [url, setUrl]
  );
  return (
    <Form onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroupAddon addonType="prepend">URL</InputGroupAddon>
        <Input
          defaultValue={state.url}
          onChange={handleUrl}
          placeholder="http://hostname:port"
        />
        <InputGroupAddon addonType="append">
          <Button>Set</Button>
        </InputGroupAddon>
      </InputGroup>
      <div className="row">
        <ProjectSelector />
        <MilestoneSelector />
      </div>
      <CustomValuesSelector />
      <DaysSelector />
    </Form>
  );
};
