- [ ] Add a test to make sure both of these work:
    this.shadowRoot.innerHTML = `<slot></slot>`;
    this.shadowRoot.innerHTML = `<some-html></some-html>`;
- [ ] Think about clashes if there are multiple providers or listeners for the `request-context` event.
- [ ] Try abstracting the data store into something provided by the ProvidableMixin.
- [ ] Gather more feedback.
- [ ] Plan another meeting.
- [ ] Put this source code somewhere and share with ShareWare.
- [ ] Think about `async` providables.
- [ ] How does the singletonmanager work??
  - It's in Lion?
- [ ] This should provide data globally and child components shouldn't provide data.
- [ ] Introduce ownership at the top of the thing at the providable mixin.
