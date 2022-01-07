
if (!Zotero.history){

    function equals(a, b){
        if (a.length != b.length) return false;
        for (let i=0; i<a.length; i++){
            if(a[i] != b[i]) return false;
        }
        return true;
    }

    function History(){

        this.maxHistoryLength = 10000;
        this.truncatedHistoryLength = 1000;
        
        this.history = [null];
        this.index = -1;
        
        this.currentItem = function(){
            return this.history[this.index];
        }
        
        this.step = function(item, collection){
            if (this.currentItem() == null || 
            !equals(this.currentItem(), [item, collection]))
            {
                this.index++;
                if (this.index == this.history.length){
                    this.history.push(null);
                }
                else{
                    this.history.splice(this.index + 1);
                }
                this.history[this.index] = [item, collection];
                if (this.history.length > this.maxHistory){
                    i = this.history.length - this.truncatedHistoryLength;
                    j = this.history.legnth;
                    this.history = this.history.slice(i, j);
                }
            }
        }
        
        this.backward = function(){
            this.index--;
            if (this.index < 0) this.index = 0;
        }
        
        this.forward = function(){
            this.index++;
            if (this.index >= this.history.length){
                this.index = this.history.length - 1;
            }
        }
        
        function handleSelect(event){
            const history = Zotero.history;
            pane = Zotero.getActiveZoteroPane();
            try{
                selected = pane.getSelectedItems();
            }
            catch(err) {
                return;
            }
            
            if (selected.length > 0){
                selected = selected[0];
                collection = pane.getSelectedCollection();
                history.step(selected, collection);
            }
        }
        
        function handleKeyup(event){
            const history = Zotero.history;
            if (event.altKey && event.code === 'ArrowLeft'){
                pane = Zotero.getActiveZoteroPane();
                history.backward();
                if (history.currentItem() != null){
                    const [item, collection] = history.currentItem();
                    pane.collectionsView.selectCollection(collection.id);
                    pane.collectionsView.selectItem(item.id);
                }
            }
            if (event.altKey && event.code == 'ArrowRight'){
                pane = Zotero.getActiveZoteroPane();
                history.forward();
                if (history.currentItem() != null){
                    const [item, collection] = history.currentItem();
                    pane.collectionsView.selectCollection(collection.id);
                    pane.collectionsView.selectItem(item.id);
                }
            }
        }
        
        this.setHandlers = function(doc){
            doc.addEventListener('select', handleSelect);
            doc.addEventListener('keyup', handleKeyup);
        }
        
    }
    
    Zotero.history = new History()

}
