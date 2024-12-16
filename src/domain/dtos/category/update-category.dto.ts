




export class UpdateCategoryDto {
    private constructor(
      public readonly id?: string,
      public readonly name?: string,
      public readonly available?: boolean
    ) {}
  
    get values() {
      const returnObj: { [key: string]: any } = {};
  
      if (this.name) returnObj.text = this.name;
  
      return returnObj;
    }
  
    static update(props: { [key: string]: any }): [string?, UpdateCategoryDto?] {
      const { id, name, available } = props;
  
      if (!id ) {
        return ["id is required"];
      }
  

  
      return [undefined, new UpdateCategoryDto(id, name, available)];
    }
  }
  