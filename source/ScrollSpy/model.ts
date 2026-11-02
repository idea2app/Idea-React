import { action, observable } from 'mobx';

export class ScrollSpyModel {
    @observable accessor activeId = '';

    @observable accessor guides:
        | {
              top: number;
              left: number;
              width: number;
              height: number;
              line: number;
              atBottom: boolean;
          }
        | undefined;

    @action
    setGuides = (guides: ScrollSpyModel['guides']) => {
        this.guides = guides;
    };

    @action
    setActiveId = (id: string) => {
        this.activeId = id;
    };
}
