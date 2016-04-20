'use strict';"use strict";
/**
 * @module
 * @description
 * This module provides a set of common Pipes.
 */
var async_pipe_1 = require('./async_pipe');
var uppercase_pipe_1 = require('./uppercase_pipe');
var lowercase_pipe_1 = require('./lowercase_pipe');
var json_pipe_1 = require('./json_pipe');
var slice_pipe_1 = require('./slice_pipe');
var date_pipe_1 = require('./date_pipe');
var number_pipe_1 = require('./number_pipe');
var replace_pipe_1 = require('./replace_pipe');
var i18n_plural_pipe_1 = require('./i18n_plural_pipe');
var i18n_select_pipe_1 = require('./i18n_select_pipe');
var lang_1 = require('angular2/src/facade/lang');
/**
 * A collection of Angular core pipes that are likely to be used in each and every
 * application.
 *
 * This collection can be used to quickly enumerate all the built-in pipes in the `pipes`
 * property of the `@Component` decorator.
 */
exports.COMMON_PIPES = lang_1.CONST_EXPR([
    async_pipe_1.AsyncPipe,
    uppercase_pipe_1.UpperCasePipe,
    lowercase_pipe_1.LowerCasePipe,
    json_pipe_1.JsonPipe,
    slice_pipe_1.SlicePipe,
    number_pipe_1.DecimalPipe,
    number_pipe_1.PercentPipe,
    number_pipe_1.CurrencyPipe,
    date_pipe_1.DatePipe,
    replace_pipe_1.ReplacePipe,
    i18n_plural_pipe_1.I18nPluralPipe,
    i18n_select_pipe_1.I18nSelectPipe
]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uX3BpcGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGlmZmluZ19wbHVnaW5fd3JhcHBlci1vdXRwdXRfcGF0aC1QREFhQW1SUS50bXAvYW5ndWxhcjIvc3JjL2NvbW1vbi9waXBlcy9jb21tb25fcGlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0dBSUc7QUFDSCwyQkFBd0IsY0FBYyxDQUFDLENBQUE7QUFDdkMsK0JBQTRCLGtCQUFrQixDQUFDLENBQUE7QUFDL0MsK0JBQTRCLGtCQUFrQixDQUFDLENBQUE7QUFDL0MsMEJBQXVCLGFBQWEsQ0FBQyxDQUFBO0FBQ3JDLDJCQUF3QixjQUFjLENBQUMsQ0FBQTtBQUN2QywwQkFBdUIsYUFBYSxDQUFDLENBQUE7QUFDckMsNEJBQXFELGVBQWUsQ0FBQyxDQUFBO0FBQ3JFLDZCQUEwQixnQkFBZ0IsQ0FBQyxDQUFBO0FBQzNDLGlDQUE2QixvQkFBb0IsQ0FBQyxDQUFBO0FBQ2xELGlDQUE2QixvQkFBb0IsQ0FBQyxDQUFBO0FBQ2xELHFCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBRXBEOzs7Ozs7R0FNRztBQUNVLG9CQUFZLEdBQUcsaUJBQVUsQ0FBQztJQUNyQyxzQkFBUztJQUNULDhCQUFhO0lBQ2IsOEJBQWE7SUFDYixvQkFBUTtJQUNSLHNCQUFTO0lBQ1QseUJBQVc7SUFDWCx5QkFBVztJQUNYLDBCQUFZO0lBQ1osb0JBQVE7SUFDUiwwQkFBVztJQUNYLGlDQUFjO0lBQ2QsaUNBQWM7Q0FDZixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBtb2R1bGVcbiAqIEBkZXNjcmlwdGlvblxuICogVGhpcyBtb2R1bGUgcHJvdmlkZXMgYSBzZXQgb2YgY29tbW9uIFBpcGVzLlxuICovXG5pbXBvcnQge0FzeW5jUGlwZX0gZnJvbSAnLi9hc3luY19waXBlJztcbmltcG9ydCB7VXBwZXJDYXNlUGlwZX0gZnJvbSAnLi91cHBlcmNhc2VfcGlwZSc7XG5pbXBvcnQge0xvd2VyQ2FzZVBpcGV9IGZyb20gJy4vbG93ZXJjYXNlX3BpcGUnO1xuaW1wb3J0IHtKc29uUGlwZX0gZnJvbSAnLi9qc29uX3BpcGUnO1xuaW1wb3J0IHtTbGljZVBpcGV9IGZyb20gJy4vc2xpY2VfcGlwZSc7XG5pbXBvcnQge0RhdGVQaXBlfSBmcm9tICcuL2RhdGVfcGlwZSc7XG5pbXBvcnQge0RlY2ltYWxQaXBlLCBQZXJjZW50UGlwZSwgQ3VycmVuY3lQaXBlfSBmcm9tICcuL251bWJlcl9waXBlJztcbmltcG9ydCB7UmVwbGFjZVBpcGV9IGZyb20gJy4vcmVwbGFjZV9waXBlJztcbmltcG9ydCB7STE4blBsdXJhbFBpcGV9IGZyb20gJy4vaTE4bl9wbHVyYWxfcGlwZSc7XG5pbXBvcnQge0kxOG5TZWxlY3RQaXBlfSBmcm9tICcuL2kxOG5fc2VsZWN0X3BpcGUnO1xuaW1wb3J0IHtDT05TVF9FWFBSfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2xhbmcnO1xuXG4vKipcbiAqIEEgY29sbGVjdGlvbiBvZiBBbmd1bGFyIGNvcmUgcGlwZXMgdGhhdCBhcmUgbGlrZWx5IHRvIGJlIHVzZWQgaW4gZWFjaCBhbmQgZXZlcnlcbiAqIGFwcGxpY2F0aW9uLlxuICpcbiAqIFRoaXMgY29sbGVjdGlvbiBjYW4gYmUgdXNlZCB0byBxdWlja2x5IGVudW1lcmF0ZSBhbGwgdGhlIGJ1aWx0LWluIHBpcGVzIGluIHRoZSBgcGlwZXNgXG4gKiBwcm9wZXJ0eSBvZiB0aGUgYEBDb21wb25lbnRgIGRlY29yYXRvci5cbiAqL1xuZXhwb3J0IGNvbnN0IENPTU1PTl9QSVBFUyA9IENPTlNUX0VYUFIoW1xuICBBc3luY1BpcGUsXG4gIFVwcGVyQ2FzZVBpcGUsXG4gIExvd2VyQ2FzZVBpcGUsXG4gIEpzb25QaXBlLFxuICBTbGljZVBpcGUsXG4gIERlY2ltYWxQaXBlLFxuICBQZXJjZW50UGlwZSxcbiAgQ3VycmVuY3lQaXBlLFxuICBEYXRlUGlwZSxcbiAgUmVwbGFjZVBpcGUsXG4gIEkxOG5QbHVyYWxQaXBlLFxuICBJMThuU2VsZWN0UGlwZVxuXSk7XG4iXX0=