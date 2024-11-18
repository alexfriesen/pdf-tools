import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'app-empty',
    templateUrl: './empty.component.html',
    styleUrls: ['./empty.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, TranslocoPipe]
})
export class EmptyComponent { }
