'use strict';"use strict";
var compile_metadata_1 = require('./compile_metadata');
var exceptions_1 = require('angular2/src/facade/exceptions');
var collection_1 = require('angular2/src/facade/collection');
var o = require('./output/output_ast');
var view_1 = require('angular2/src/core/linker/view');
var util_1 = require('./util');
var _HOST_VIEW_FACTORY_IDENTIFIER = new compile_metadata_1.CompileIdentifierMetadata({
    name: 'HostViewFactory',
    runtime: view_1.HostViewFactory,
    moduleUrl: "asset:angular2/lib/src/core/linker/view" + util_1.MODULE_SUFFIX
});
var SourceModule = (function () {
    function SourceModule(moduleUrl, source) {
        this.moduleUrl = moduleUrl;
        this.source = source;
    }
    return SourceModule;
}());
exports.SourceModule = SourceModule;
var NormalizedComponentWithViewDirectives = (function () {
    function NormalizedComponentWithViewDirectives(component, directives, pipes) {
        this.component = component;
        this.directives = directives;
        this.pipes = pipes;
    }
    return NormalizedComponentWithViewDirectives;
}());
exports.NormalizedComponentWithViewDirectives = NormalizedComponentWithViewDirectives;
var OfflineCompiler = (function () {
    function OfflineCompiler(_directiveNormalizer, _templateParser, _styleCompiler, _viewCompiler, _outputEmitter) {
        this._directiveNormalizer = _directiveNormalizer;
        this._templateParser = _templateParser;
        this._styleCompiler = _styleCompiler;
        this._viewCompiler = _viewCompiler;
        this._outputEmitter = _outputEmitter;
    }
    OfflineCompiler.prototype.normalizeDirectiveMetadata = function (directive) {
        return this._directiveNormalizer.normalizeDirective(directive);
    };
    OfflineCompiler.prototype.compileTemplates = function (components) {
        var _this = this;
        if (components.length === 0) {
            throw new exceptions_1.BaseException('No components given');
        }
        var statements = [];
        var exportedVars = [];
        var moduleUrl = _templateModuleUrl(components[0].component);
        components.forEach(function (componentWithDirs) {
            var compMeta = componentWithDirs.component;
            _assertComponent(compMeta);
            var compViewFactoryVar = _this._compileComponent(compMeta, componentWithDirs.directives, componentWithDirs.pipes, statements);
            exportedVars.push(compViewFactoryVar);
            var hostMeta = compile_metadata_1.createHostComponentMeta(compMeta.type, compMeta.selector);
            var compHostViewFactoryVar = _this._compileComponent(hostMeta, [compMeta], [], statements);
            var hostViewFactoryVar = "hostViewFactory_" + compMeta.type.name;
            statements.push(o.variable(hostViewFactoryVar)
                .set(o.importExpr(_HOST_VIEW_FACTORY_IDENTIFIER)
                .instantiate([o.literal(compMeta.selector), o.variable(compHostViewFactoryVar)], o.importType(_HOST_VIEW_FACTORY_IDENTIFIER, null, [o.TypeModifier.Const])))
                .toDeclStmt(null, [o.StmtModifier.Final]));
            exportedVars.push(hostViewFactoryVar);
        });
        return this._codegenSourceModule(moduleUrl, statements, exportedVars);
    };
    OfflineCompiler.prototype.compileStylesheet = function (stylesheetUrl, cssText) {
        var plainStyles = this._styleCompiler.compileStylesheet(stylesheetUrl, cssText, false);
        var shimStyles = this._styleCompiler.compileStylesheet(stylesheetUrl, cssText, true);
        return [
            this._codegenSourceModule(_stylesModuleUrl(stylesheetUrl, false), _resolveStyleStatements(plainStyles), [plainStyles.stylesVar]),
            this._codegenSourceModule(_stylesModuleUrl(stylesheetUrl, true), _resolveStyleStatements(shimStyles), [shimStyles.stylesVar])
        ];
    };
    OfflineCompiler.prototype._compileComponent = function (compMeta, directives, pipes, targetStatements) {
        var styleResult = this._styleCompiler.compileComponent(compMeta);
        var parsedTemplate = this._templateParser.parse(compMeta, compMeta.template.template, directives, pipes, compMeta.type.name);
        var viewResult = this._viewCompiler.compileComponent(compMeta, parsedTemplate, o.variable(styleResult.stylesVar), pipes);
        collection_1.ListWrapper.addAll(targetStatements, _resolveStyleStatements(styleResult));
        collection_1.ListWrapper.addAll(targetStatements, _resolveViewStatements(viewResult));
        return viewResult.viewFactoryVar;
    };
    OfflineCompiler.prototype._codegenSourceModule = function (moduleUrl, statements, exportedVars) {
        return new SourceModule(moduleUrl, this._outputEmitter.emitStatements(moduleUrl, statements, exportedVars));
    };
    return OfflineCompiler;
}());
exports.OfflineCompiler = OfflineCompiler;
function _resolveViewStatements(compileResult) {
    compileResult.dependencies.forEach(function (dep) { dep.factoryPlaceholder.moduleUrl = _templateModuleUrl(dep.comp); });
    return compileResult.statements;
}
function _resolveStyleStatements(compileResult) {
    compileResult.dependencies.forEach(function (dep) {
        dep.valuePlaceholder.moduleUrl = _stylesModuleUrl(dep.sourceUrl, dep.isShimmed);
    });
    return compileResult.statements;
}
function _templateModuleUrl(comp) {
    var moduleUrl = comp.type.moduleUrl;
    var urlWithoutSuffix = moduleUrl.substring(0, moduleUrl.length - util_1.MODULE_SUFFIX.length);
    return urlWithoutSuffix + ".template" + util_1.MODULE_SUFFIX;
}
function _stylesModuleUrl(stylesheetUrl, shim) {
    return shim ? stylesheetUrl + ".shim" + util_1.MODULE_SUFFIX : "" + stylesheetUrl + util_1.MODULE_SUFFIX;
}
function _assertComponent(meta) {
    if (!meta.isComponent) {
        throw new exceptions_1.BaseException("Could not compile '" + meta.type.name + "' because it is not a component.");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2ZmbGluZV9jb21waWxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtUERBYUFtUlEudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci9vZmZsaW5lX2NvbXBpbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxpQ0FLTyxvQkFBb0IsQ0FBQyxDQUFBO0FBRTVCLDJCQUEyQyxnQ0FBZ0MsQ0FBQyxDQUFBO0FBQzVFLDJCQUEwQixnQ0FBZ0MsQ0FBQyxDQUFBO0FBTTNELElBQVksQ0FBQyxXQUFNLHFCQUFxQixDQUFDLENBQUE7QUFDekMscUJBQThCLCtCQUErQixDQUFDLENBQUE7QUFFOUQscUJBRU8sUUFBUSxDQUFDLENBQUE7QUFFaEIsSUFBSSw2QkFBNkIsR0FBRyxJQUFJLDRDQUF5QixDQUFDO0lBQ2hFLElBQUksRUFBRSxpQkFBaUI7SUFDdkIsT0FBTyxFQUFFLHNCQUFlO0lBQ3hCLFNBQVMsRUFBRSw0Q0FBMEMsb0JBQWU7Q0FDckUsQ0FBQyxDQUFDO0FBRUg7SUFDRSxzQkFBbUIsU0FBaUIsRUFBUyxNQUFjO1FBQXhDLGNBQVMsR0FBVCxTQUFTLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUcsQ0FBQztJQUNqRSxtQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksb0JBQVksZUFFeEIsQ0FBQTtBQUVEO0lBQ0UsK0NBQW1CLFNBQW1DLEVBQ25DLFVBQXNDLEVBQVMsS0FBNEI7UUFEM0UsY0FBUyxHQUFULFNBQVMsQ0FBMEI7UUFDbkMsZUFBVSxHQUFWLFVBQVUsQ0FBNEI7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUF1QjtJQUFHLENBQUM7SUFDcEcsNENBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLDZDQUFxQyx3Q0FHakQsQ0FBQTtBQUVEO0lBQ0UseUJBQW9CLG9CQUF5QyxFQUN6QyxlQUErQixFQUFVLGNBQTZCLEVBQ3RFLGFBQTJCLEVBQVUsY0FBNkI7UUFGbEUseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFxQjtRQUN6QyxvQkFBZSxHQUFmLGVBQWUsQ0FBZ0I7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQUN0RSxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBQUcsQ0FBQztJQUUxRixvREFBMEIsR0FBMUIsVUFBMkIsU0FBbUM7UUFFNUQsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBRUQsMENBQWdCLEdBQWhCLFVBQWlCLFVBQW1EO1FBQXBFLGlCQTRCQztRQTNCQyxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxJQUFJLDBCQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQUNqRCxDQUFDO1FBQ0QsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLElBQUksWUFBWSxHQUFHLEVBQUUsQ0FBQztRQUN0QixJQUFJLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUQsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFBLGlCQUFpQjtZQUNsQyxJQUFJLFFBQVEsR0FBNkIsaUJBQWlCLENBQUMsU0FBUyxDQUFDO1lBQ3JFLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzNCLElBQUksa0JBQWtCLEdBQUcsS0FBSSxDQUFDLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxVQUFVLEVBQ3RDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztZQUNyRixZQUFZLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFFdEMsSUFBSSxRQUFRLEdBQUcsMENBQXVCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekUsSUFBSSxzQkFBc0IsR0FBRyxLQUFJLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1lBQzFGLElBQUksa0JBQWtCLEdBQUcscUJBQW1CLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBTSxDQUFDO1lBQ2pFLFVBQVUsQ0FBQyxJQUFJLENBQ1gsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDekIsR0FBRyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsNkJBQTZCLENBQUM7aUJBQ3RDLFdBQVcsQ0FDUixDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxFQUNsRSxDQUFDLENBQUMsVUFBVSxDQUFDLDZCQUE2QixFQUFFLElBQUksRUFDbkMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEQsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25ELFlBQVksQ0FBQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN4QyxDQUFDLENBQUMsQ0FBQztRQUNILE1BQU0sQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQsMkNBQWlCLEdBQWpCLFVBQWtCLGFBQXFCLEVBQUUsT0FBZTtRQUN0RCxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkYsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3JGLE1BQU0sQ0FBQztZQUNMLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsS0FBSyxDQUFDLEVBQ3RDLHVCQUF1QixDQUFDLFdBQVcsQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3hGLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLEVBQ3JDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZGLENBQUM7SUFDSixDQUFDO0lBRU8sMkNBQWlCLEdBQXpCLFVBQTBCLFFBQWtDLEVBQ2xDLFVBQXNDLEVBQUUsS0FBNEIsRUFDcEUsZ0JBQStCO1FBQ3ZELElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakUsSUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUNwQyxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkYsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUN4QixDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUMvRix3QkFBVyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSx1QkFBdUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO1FBQzNFLHdCQUFXLENBQUMsTUFBTSxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDekUsTUFBTSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUM7SUFDbkMsQ0FBQztJQUdPLDhDQUFvQixHQUE1QixVQUE2QixTQUFpQixFQUFFLFVBQXlCLEVBQzVDLFlBQXNCO1FBQ2pELE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FDbkIsU0FBUyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBdEVELElBc0VDO0FBdEVZLHVCQUFlLGtCQXNFM0IsQ0FBQTtBQUVELGdDQUFnQyxhQUFnQztJQUM5RCxhQUFhLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FDOUIsVUFBQyxHQUFHLElBQU8sR0FBRyxDQUFDLGtCQUFrQixDQUFDLFNBQVMsR0FBRyxrQkFBa0IsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNuRixNQUFNLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQztBQUNsQyxDQUFDO0FBR0QsaUNBQWlDLGFBQWtDO0lBQ2pFLGFBQWEsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRztRQUNyQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxHQUFHLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUM7QUFDbEMsQ0FBQztBQUVELDRCQUE0QixJQUE4QjtJQUN4RCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUNwQyxJQUFJLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsb0JBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2RixNQUFNLENBQUksZ0JBQWdCLGlCQUFZLG9CQUFlLENBQUM7QUFDeEQsQ0FBQztBQUVELDBCQUEwQixhQUFxQixFQUFFLElBQWE7SUFDNUQsTUFBTSxDQUFDLElBQUksR0FBTSxhQUFhLGFBQVEsb0JBQWUsR0FBRyxLQUFHLGFBQWEsR0FBRyxvQkFBZSxDQUFDO0FBQzdGLENBQUM7QUFFRCwwQkFBMEIsSUFBOEI7SUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztRQUN0QixNQUFNLElBQUksMEJBQWEsQ0FBQyx3QkFBc0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLHFDQUFrQyxDQUFDLENBQUM7SUFDbEcsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVQaXBlTWV0YWRhdGEsXG4gIGNyZWF0ZUhvc3RDb21wb25lbnRNZXRhXG59IGZyb20gJy4vY29tcGlsZV9tZXRhZGF0YSc7XG5cbmltcG9ydCB7QmFzZUV4Y2VwdGlvbiwgdW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7TGlzdFdyYXBwZXJ9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvY29sbGVjdGlvbic7XG5pbXBvcnQge1N0eWxlQ29tcGlsZXIsIFN0eWxlc0NvbXBpbGVEZXBlbmRlbmN5LCBTdHlsZXNDb21waWxlUmVzdWx0fSBmcm9tICcuL3N0eWxlX2NvbXBpbGVyJztcbmltcG9ydCB7Vmlld0NvbXBpbGVyLCBWaWV3Q29tcGlsZVJlc3VsdH0gZnJvbSAnLi92aWV3X2NvbXBpbGVyL3ZpZXdfY29tcGlsZXInO1xuaW1wb3J0IHtUZW1wbGF0ZVBhcnNlcn0gZnJvbSAnLi90ZW1wbGF0ZV9wYXJzZXInO1xuaW1wb3J0IHtEaXJlY3RpdmVOb3JtYWxpemVyfSBmcm9tICcuL2RpcmVjdGl2ZV9ub3JtYWxpemVyJztcbmltcG9ydCB7T3V0cHV0RW1pdHRlcn0gZnJvbSAnLi9vdXRwdXQvYWJzdHJhY3RfZW1pdHRlcic7XG5pbXBvcnQgKiBhcyBvIGZyb20gJy4vb3V0cHV0L291dHB1dF9hc3QnO1xuaW1wb3J0IHtIb3N0Vmlld0ZhY3Rvcnl9IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci92aWV3JztcblxuaW1wb3J0IHtcbiAgTU9EVUxFX1NVRkZJWCxcbn0gZnJvbSAnLi91dGlsJztcblxudmFyIF9IT1NUX1ZJRVdfRkFDVE9SWV9JREVOVElGSUVSID0gbmV3IENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEoe1xuICBuYW1lOiAnSG9zdFZpZXdGYWN0b3J5JyxcbiAgcnVudGltZTogSG9zdFZpZXdGYWN0b3J5LFxuICBtb2R1bGVVcmw6IGBhc3NldDphbmd1bGFyMi9saWIvc3JjL2NvcmUvbGlua2VyL3ZpZXcke01PRFVMRV9TVUZGSVh9YFxufSk7XG5cbmV4cG9ydCBjbGFzcyBTb3VyY2VNb2R1bGUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgbW9kdWxlVXJsOiBzdHJpbmcsIHB1YmxpYyBzb3VyY2U6IHN0cmluZykge31cbn1cblxuZXhwb3J0IGNsYXNzIE5vcm1hbGl6ZWRDb21wb25lbnRXaXRoVmlld0RpcmVjdGl2ZXMge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29tcG9uZW50OiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgIHB1YmxpYyBkaXJlY3RpdmVzOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGFbXSwgcHVibGljIHBpcGVzOiBDb21waWxlUGlwZU1ldGFkYXRhW10pIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBPZmZsaW5lQ29tcGlsZXIge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9kaXJlY3RpdmVOb3JtYWxpemVyOiBEaXJlY3RpdmVOb3JtYWxpemVyLFxuICAgICAgICAgICAgICBwcml2YXRlIF90ZW1wbGF0ZVBhcnNlcjogVGVtcGxhdGVQYXJzZXIsIHByaXZhdGUgX3N0eWxlQ29tcGlsZXI6IFN0eWxlQ29tcGlsZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgX3ZpZXdDb21waWxlcjogVmlld0NvbXBpbGVyLCBwcml2YXRlIF9vdXRwdXRFbWl0dGVyOiBPdXRwdXRFbWl0dGVyKSB7fVxuXG4gIG5vcm1hbGl6ZURpcmVjdGl2ZU1ldGFkYXRhKGRpcmVjdGl2ZTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhKTpcbiAgICAgIFByb21pc2U8Q29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhPiB7XG4gICAgcmV0dXJuIHRoaXMuX2RpcmVjdGl2ZU5vcm1hbGl6ZXIubm9ybWFsaXplRGlyZWN0aXZlKGRpcmVjdGl2ZSk7XG4gIH1cblxuICBjb21waWxlVGVtcGxhdGVzKGNvbXBvbmVudHM6IE5vcm1hbGl6ZWRDb21wb25lbnRXaXRoVmlld0RpcmVjdGl2ZXNbXSk6IFNvdXJjZU1vZHVsZSB7XG4gICAgaWYgKGNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbignTm8gY29tcG9uZW50cyBnaXZlbicpO1xuICAgIH1cbiAgICB2YXIgc3RhdGVtZW50cyA9IFtdO1xuICAgIHZhciBleHBvcnRlZFZhcnMgPSBbXTtcbiAgICB2YXIgbW9kdWxlVXJsID0gX3RlbXBsYXRlTW9kdWxlVXJsKGNvbXBvbmVudHNbMF0uY29tcG9uZW50KTtcbiAgICBjb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50V2l0aERpcnMgPT4ge1xuICAgICAgdmFyIGNvbXBNZXRhID0gPENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YT5jb21wb25lbnRXaXRoRGlycy5jb21wb25lbnQ7XG4gICAgICBfYXNzZXJ0Q29tcG9uZW50KGNvbXBNZXRhKTtcbiAgICAgIHZhciBjb21wVmlld0ZhY3RvcnlWYXIgPSB0aGlzLl9jb21waWxlQ29tcG9uZW50KGNvbXBNZXRhLCBjb21wb25lbnRXaXRoRGlycy5kaXJlY3RpdmVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcG9uZW50V2l0aERpcnMucGlwZXMsIHN0YXRlbWVudHMpO1xuICAgICAgZXhwb3J0ZWRWYXJzLnB1c2goY29tcFZpZXdGYWN0b3J5VmFyKTtcblxuICAgICAgdmFyIGhvc3RNZXRhID0gY3JlYXRlSG9zdENvbXBvbmVudE1ldGEoY29tcE1ldGEudHlwZSwgY29tcE1ldGEuc2VsZWN0b3IpO1xuICAgICAgdmFyIGNvbXBIb3N0Vmlld0ZhY3RvcnlWYXIgPSB0aGlzLl9jb21waWxlQ29tcG9uZW50KGhvc3RNZXRhLCBbY29tcE1ldGFdLCBbXSwgc3RhdGVtZW50cyk7XG4gICAgICB2YXIgaG9zdFZpZXdGYWN0b3J5VmFyID0gYGhvc3RWaWV3RmFjdG9yeV8ke2NvbXBNZXRhLnR5cGUubmFtZX1gO1xuICAgICAgc3RhdGVtZW50cy5wdXNoKFxuICAgICAgICAgIG8udmFyaWFibGUoaG9zdFZpZXdGYWN0b3J5VmFyKVxuICAgICAgICAgICAgICAuc2V0KG8uaW1wb3J0RXhwcihfSE9TVF9WSUVXX0ZBQ1RPUllfSURFTlRJRklFUilcbiAgICAgICAgICAgICAgICAgICAgICAgLmluc3RhbnRpYXRlKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW28ubGl0ZXJhbChjb21wTWV0YS5zZWxlY3RvciksIG8udmFyaWFibGUoY29tcEhvc3RWaWV3RmFjdG9yeVZhcildLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgby5pbXBvcnRUeXBlKF9IT1NUX1ZJRVdfRkFDVE9SWV9JREVOVElGSUVSLCBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtvLlR5cGVNb2RpZmllci5Db25zdF0pKSlcbiAgICAgICAgICAgICAgLnRvRGVjbFN0bXQobnVsbCwgW28uU3RtdE1vZGlmaWVyLkZpbmFsXSkpO1xuICAgICAgZXhwb3J0ZWRWYXJzLnB1c2goaG9zdFZpZXdGYWN0b3J5VmFyKTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcy5fY29kZWdlblNvdXJjZU1vZHVsZShtb2R1bGVVcmwsIHN0YXRlbWVudHMsIGV4cG9ydGVkVmFycyk7XG4gIH1cblxuICBjb21waWxlU3R5bGVzaGVldChzdHlsZXNoZWV0VXJsOiBzdHJpbmcsIGNzc1RleHQ6IHN0cmluZyk6IFNvdXJjZU1vZHVsZVtdIHtcbiAgICB2YXIgcGxhaW5TdHlsZXMgPSB0aGlzLl9zdHlsZUNvbXBpbGVyLmNvbXBpbGVTdHlsZXNoZWV0KHN0eWxlc2hlZXRVcmwsIGNzc1RleHQsIGZhbHNlKTtcbiAgICB2YXIgc2hpbVN0eWxlcyA9IHRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZVN0eWxlc2hlZXQoc3R5bGVzaGVldFVybCwgY3NzVGV4dCwgdHJ1ZSk7XG4gICAgcmV0dXJuIFtcbiAgICAgIHRoaXMuX2NvZGVnZW5Tb3VyY2VNb2R1bGUoX3N0eWxlc01vZHVsZVVybChzdHlsZXNoZWV0VXJsLCBmYWxzZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF9yZXNvbHZlU3R5bGVTdGF0ZW1lbnRzKHBsYWluU3R5bGVzKSwgW3BsYWluU3R5bGVzLnN0eWxlc1Zhcl0pLFxuICAgICAgdGhpcy5fY29kZWdlblNvdXJjZU1vZHVsZShfc3R5bGVzTW9kdWxlVXJsKHN0eWxlc2hlZXRVcmwsIHRydWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfcmVzb2x2ZVN0eWxlU3RhdGVtZW50cyhzaGltU3R5bGVzKSwgW3NoaW1TdHlsZXMuc3R5bGVzVmFyXSlcbiAgICBdO1xuICB9XG5cbiAgcHJpdmF0ZSBfY29tcGlsZUNvbXBvbmVudChjb21wTWV0YTogQ29tcGlsZURpcmVjdGl2ZU1ldGFkYXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXM6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YVtdLCBwaXBlczogQ29tcGlsZVBpcGVNZXRhZGF0YVtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRhcmdldFN0YXRlbWVudHM6IG8uU3RhdGVtZW50W10pOiBzdHJpbmcge1xuICAgIHZhciBzdHlsZVJlc3VsdCA9IHRoaXMuX3N0eWxlQ29tcGlsZXIuY29tcGlsZUNvbXBvbmVudChjb21wTWV0YSk7XG4gICAgdmFyIHBhcnNlZFRlbXBsYXRlID0gdGhpcy5fdGVtcGxhdGVQYXJzZXIucGFyc2UoY29tcE1ldGEsIGNvbXBNZXRhLnRlbXBsYXRlLnRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZXMsIHBpcGVzLCBjb21wTWV0YS50eXBlLm5hbWUpO1xuICAgIHZhciB2aWV3UmVzdWx0ID0gdGhpcy5fdmlld0NvbXBpbGVyLmNvbXBpbGVDb21wb25lbnQoY29tcE1ldGEsIHBhcnNlZFRlbXBsYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgby52YXJpYWJsZShzdHlsZVJlc3VsdC5zdHlsZXNWYXIpLCBwaXBlcyk7XG4gICAgTGlzdFdyYXBwZXIuYWRkQWxsKHRhcmdldFN0YXRlbWVudHMsIF9yZXNvbHZlU3R5bGVTdGF0ZW1lbnRzKHN0eWxlUmVzdWx0KSk7XG4gICAgTGlzdFdyYXBwZXIuYWRkQWxsKHRhcmdldFN0YXRlbWVudHMsIF9yZXNvbHZlVmlld1N0YXRlbWVudHModmlld1Jlc3VsdCkpO1xuICAgIHJldHVybiB2aWV3UmVzdWx0LnZpZXdGYWN0b3J5VmFyO1xuICB9XG5cblxuICBwcml2YXRlIF9jb2RlZ2VuU291cmNlTW9kdWxlKG1vZHVsZVVybDogc3RyaW5nLCBzdGF0ZW1lbnRzOiBvLlN0YXRlbWVudFtdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9ydGVkVmFyczogc3RyaW5nW10pOiBTb3VyY2VNb2R1bGUge1xuICAgIHJldHVybiBuZXcgU291cmNlTW9kdWxlKFxuICAgICAgICBtb2R1bGVVcmwsIHRoaXMuX291dHB1dEVtaXR0ZXIuZW1pdFN0YXRlbWVudHMobW9kdWxlVXJsLCBzdGF0ZW1lbnRzLCBleHBvcnRlZFZhcnMpKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfcmVzb2x2ZVZpZXdTdGF0ZW1lbnRzKGNvbXBpbGVSZXN1bHQ6IFZpZXdDb21waWxlUmVzdWx0KTogby5TdGF0ZW1lbnRbXSB7XG4gIGNvbXBpbGVSZXN1bHQuZGVwZW5kZW5jaWVzLmZvckVhY2goXG4gICAgICAoZGVwKSA9PiB7IGRlcC5mYWN0b3J5UGxhY2Vob2xkZXIubW9kdWxlVXJsID0gX3RlbXBsYXRlTW9kdWxlVXJsKGRlcC5jb21wKTsgfSk7XG4gIHJldHVybiBjb21waWxlUmVzdWx0LnN0YXRlbWVudHM7XG59XG5cblxuZnVuY3Rpb24gX3Jlc29sdmVTdHlsZVN0YXRlbWVudHMoY29tcGlsZVJlc3VsdDogU3R5bGVzQ29tcGlsZVJlc3VsdCk6IG8uU3RhdGVtZW50W10ge1xuICBjb21waWxlUmVzdWx0LmRlcGVuZGVuY2llcy5mb3JFYWNoKChkZXApID0+IHtcbiAgICBkZXAudmFsdWVQbGFjZWhvbGRlci5tb2R1bGVVcmwgPSBfc3R5bGVzTW9kdWxlVXJsKGRlcC5zb3VyY2VVcmwsIGRlcC5pc1NoaW1tZWQpO1xuICB9KTtcbiAgcmV0dXJuIGNvbXBpbGVSZXN1bHQuc3RhdGVtZW50cztcbn1cblxuZnVuY3Rpb24gX3RlbXBsYXRlTW9kdWxlVXJsKGNvbXA6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSk6IHN0cmluZyB7XG4gIHZhciBtb2R1bGVVcmwgPSBjb21wLnR5cGUubW9kdWxlVXJsO1xuICB2YXIgdXJsV2l0aG91dFN1ZmZpeCA9IG1vZHVsZVVybC5zdWJzdHJpbmcoMCwgbW9kdWxlVXJsLmxlbmd0aCAtIE1PRFVMRV9TVUZGSVgubGVuZ3RoKTtcbiAgcmV0dXJuIGAke3VybFdpdGhvdXRTdWZmaXh9LnRlbXBsYXRlJHtNT0RVTEVfU1VGRklYfWA7XG59XG5cbmZ1bmN0aW9uIF9zdHlsZXNNb2R1bGVVcmwoc3R5bGVzaGVldFVybDogc3RyaW5nLCBzaGltOiBib29sZWFuKTogc3RyaW5nIHtcbiAgcmV0dXJuIHNoaW0gPyBgJHtzdHlsZXNoZWV0VXJsfS5zaGltJHtNT0RVTEVfU1VGRklYfWAgOiBgJHtzdHlsZXNoZWV0VXJsfSR7TU9EVUxFX1NVRkZJWH1gO1xufVxuXG5mdW5jdGlvbiBfYXNzZXJ0Q29tcG9uZW50KG1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSkge1xuICBpZiAoIW1ldGEuaXNDb21wb25lbnQpIHtcbiAgICB0aHJvdyBuZXcgQmFzZUV4Y2VwdGlvbihgQ291bGQgbm90IGNvbXBpbGUgJyR7bWV0YS50eXBlLm5hbWV9JyBiZWNhdXNlIGl0IGlzIG5vdCBhIGNvbXBvbmVudC5gKTtcbiAgfVxufVxuIl19