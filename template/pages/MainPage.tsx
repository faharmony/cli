// {{Sample}}:MainView
import React from "react";
import { PageView } from "@faharmony/views";
import { useLocale } from "@faharmony/locale";
import { Text, Button, Box, Icon } from "@faharmony/components";
import { faSpinner } from "@faharmony/icons";
import { useDispatch, useModuleState } from "@faharmony/state";
import { ModuleActions, IModuleState } from "../state";

const SampleState = () => {
  const t = useLocale();
  const dispatch = useDispatch();
  const state = useModuleState<IModuleState>();
  return (
    <Box>
      <Text value={t("loading")} />
      <Icon spin={state.loading} icon={faSpinner} />
      <Button
        value="Start"
        onClick={() => dispatch(ModuleActions.setLoading(true))}
      />
      <Button
        value="Stop"
        onClick={() => dispatch(ModuleActions.setLoading(false))}
      />
      <Button
        value="Toggle"
        onClick={() => dispatch(ModuleActions.toggleLoading())}
      />
    </Box>
  );
};

/**
 * Default page of module
 * @author Siddhant Gupta <siddhant@fasolutions.com>
 */
export const MainPage = () => {
  const t = useLocale();
  return (
    <PageView heading={t("moduleName")}>
      <SampleState />
    </PageView>
  );
};

export default MainPage;
